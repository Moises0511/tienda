"""
============================================================================
NEXUS GEAR MX - SERVIDOR WEB Y API REST (server.py)
Aplicación Web completa con Flask y SQLite
Cumple con 13 tablas relacionales en 3FN y PRAGMA foreign_keys = ON
============================================================================
"""

import os
import json
import random
import datetime
from flask import Flask, request, jsonify, send_from_directory, session, redirect
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from database import get_db, init_db

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.join(os.path.dirname(BASE_DIR), 'frontend')

app = Flask(__name__, static_folder=FRONTEND_DIR, static_url_path='')
app.secret_key = 'nexus_gear_mx_secret_school_project_2026_tabasco'


def get_session_user():
    """Retorna el usuario autenticado en la sesión Flask o None."""
    usuario_id = session.get('usuario_id')
    if not usuario_id:
        return None
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id, nombre, correo, telefono, rol FROM usuarios WHERE id = ?;", (usuario_id,))
    user = cursor.fetchone()
    conn.close()
    return dict(user) if user else None


def require_admin():
    """Valida que la sesión pertenezca a un usuario con rol admin."""
    user = get_session_user()
    if not user or user.get('rol') != 'admin':
        return None, (jsonify({"ok": False, "error": "Acceso restringido a administradores"}), 403)
    return user, None


def correo_es_estudiante(correo):
    """Verifica si el correo pertenece a un estudiante UJAT (@alumno.ujat.mx)."""
    return bool(correo) and correo.strip().lower().endswith('@alumno.ujat.mx')


def parse_variantes(raw):
    """Convierte la columna variantes (JSON) a dict; None si no hay datos válidos."""
    if not raw:
        return None
    try:
        data = json.loads(raw)
        return data if isinstance(data, dict) and data else None
    except (ValueError, TypeError):
        return None


def calcular_variante(variantes, seleccion):
    """
    Valida la selección de variantes contra el catálogo del producto.
    'seleccion' es un dict {grupo: opcion}. Retorna (etiqueta, precio_extra).
    """
    if not variantes or not seleccion:
        return None, 0.0
    etiqueta_parts = []
    extra = 0.0
    for grupo, opcion in seleccion.items():
        opciones = variantes.get(grupo)
        if not isinstance(opciones, dict) or opcion not in opciones:
            continue
        etiqueta_parts.append(f"{grupo}: {opcion}")
        try:
            extra += float(opciones[opcion] or 0)
        except (TypeError, ValueError):
            pass
    if not etiqueta_parts:
        return None, 0.0
    return " | ".join(etiqueta_parts), extra


# ============================================================================
# RUTAS ESTÁTICAS Y VISTAS HTML
# ============================================================================

@app.route('/')
def route_index():
    return send_from_directory(FRONTEND_DIR, 'index.html')

@app.route('/bd.html')
@app.route('/bd')
def route_bd_admin():
    user = get_session_user()
    if not user or user.get('rol') != 'admin':
        return redirect('/cuenta.html')
    return send_from_directory(FRONTEND_DIR, 'bd.html')


@app.route('/admin.html')
@app.route('/admin')
def route_admin_panel():
    user = get_session_user()
    if not user or user.get('rol') != 'admin':
        return redirect('/cuenta.html')
    return send_from_directory(FRONTEND_DIR, 'admin.html')


@app.route('/vendedor.html')
@app.route('/vendedor')
def route_vendedor_panel():
    user = get_session_user()
    if not user or user.get('rol') not in ('admin', 'vendedor'):
        return redirect('/cuenta.html')
    return send_from_directory(FRONTEND_DIR, 'vendedor.html')

@app.route('/<path:filename>')
def route_static_files(filename):
    normalized = filename.replace('\\', '/').lower()
    if normalized in ('bd.html', 'bd'):
        user = get_session_user()
        if not user or user.get('rol') != 'admin':
            return redirect('/cuenta.html')

    file_path = os.path.join(FRONTEND_DIR, filename)
    if os.path.isfile(file_path):
        return send_from_directory(FRONTEND_DIR, filename)
    # Si la ruta no tiene extensión y existe con .html
    if not os.path.splitext(filename)[1]:
        html_candidate = file_path + '.html'
        if os.path.isfile(html_candidate):
            return send_from_directory(FRONTEND_DIR, filename + '.html')
    return send_from_directory(FRONTEND_DIR, 'index.html')


# ============================================================================
# API 1: CATEGORÍAS
# ============================================================================

@app.route('/api/categorias', methods=['GET'])
def get_categorias():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT c.id, c.nombre, c.slug, COUNT(p.id) AS total_productos
        FROM categorias c
        LEFT JOIN productos p ON p.categoria_id = c.id AND p.activo = 1
        GROUP BY c.id
        ORDER BY c.id ASC;
    """)
    rows = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return jsonify({"ok": True, "categorias": rows})


# ============================================================================
# API 2: PRODUCTOS (CATÁLOGO, FILTROS, ORDENAMIENTO Y CALIFICACIÓN DINÁMICA)
# ============================================================================

@app.route('/api/productos', methods=['GET'])
def get_productos():
    conn = get_db()
    cursor = conn.cursor()

    # Parámetros de consulta
    cat_slug = request.args.get('cat', 'all')
    subcat = request.args.get('subcat', 'all')
    search_q = request.args.get('q', '').strip().lower()
    min_price = request.args.get('min_price', type=float)
    max_price = request.args.get('max_price', type=float)
    connectivity = request.args.get('connectivity')
    rgb = request.args.get('rgb', type=int)
    pickup = request.args.get('pickup', type=int)
    free_shipping = request.args.get('free_shipping', type=int)
    target = request.args.get('target') # 'gamer', 'estudio', 'ambos'
    flash_deals = request.args.get('flash', type=int)
    sort_by = request.args.get('sort', 'popular')
    brands = request.args.get('brands') # marcas separadas por coma
    limit = request.args.get('limit', type=int)

    query = """
        SELECT p.id, p.categoria_id, p.nombre, p.marca, p.subcategoria, p.descripcion,
               p.precio, p.precio_original, p.conectividad, p.etiqueta_conexion,
               p.rgb, p.retiro_villahermosa, p.envio_gratis, p.publico, p.tipo_ilustracion,
               p.stock, p.stock_flash, p.popularidad, p.fecha_alta, p.foto, p.activo, p.variantes,
               c.nombre AS categoria_nombre, c.slug AS categoria_slug,
               ROUND(COALESCE(AVG(r.calificacion), 5.0), 1) AS rating,
               COUNT(r.id) AS reviewsCount
        FROM productos p
        JOIN categorias c ON p.categoria_id = c.id
        LEFT JOIN resenas r ON r.producto_id = p.id
        WHERE p.activo = 1
    """
    params = []

    if cat_slug and cat_slug != 'all':
        query += " AND c.slug = ?"
        params.append(cat_slug)

    if subcat and subcat != 'all':
        query += " AND LOWER(p.subcategoria) = ?"
        params.append(subcat.lower())

    if search_q:
        query += " AND (LOWER(p.nombre) LIKE ? OR LOWER(p.marca) LIKE ? OR LOWER(p.descripcion) LIKE ? OR LOWER(p.subcategoria) LIKE ?)"
        wildcard = f"%{search_q}%"
        params.extend([wildcard, wildcard, wildcard, wildcard])

    if min_price is not None:
        query += " AND p.precio >= ?"
        params.append(min_price)

    if max_price is not None:
        query += " AND p.precio <= ?"
        params.append(max_price)

    if connectivity:
        query += " AND p.conectividad = ?"
        params.append(connectivity)

    if rgb is not None:
        query += " AND p.rgb = ?"
        params.append(rgb)

    if pickup is not None:
        query += " AND p.retiro_villahermosa = ?"
        params.append(pickup)

    if free_shipping is not None:
        query += " AND p.envio_gratis = ?"
        params.append(free_shipping)

    if target:
        query += " AND (p.publico = ? OR p.publico = 'ambos')"
        params.append(target)

    if flash_deals == 1:
        query += " AND p.precio_original IS NOT NULL AND p.precio_original > p.precio"

    if brands:
        brand_list = [b.strip() for b in brands.split(',') if b.strip()]
        if brand_list:
            placeholders = ','.join(['?'] * len(brand_list))
            query += f" AND p.marca IN ({placeholders})"
            params.extend(brand_list)

    query += " GROUP BY p.id"

    # Ordenamiento
    if sort_by == 'price-asc':
        query += " ORDER BY p.precio ASC"
    elif sort_by == 'price-desc':
        query += " ORDER BY p.precio DESC"
    elif sort_by == 'rating':
        query += " ORDER BY rating DESC, reviewsCount DESC"
    elif sort_by == 'newest':
        query += " ORDER BY p.fecha_alta DESC"
    else: # 'popular'
        query += " ORDER BY p.popularidad DESC, p.id ASC"

    if limit and limit > 0:
        query += " LIMIT ?"
        params.append(limit)

    cursor.execute(query, params)
    productos = [dict(r) for r in cursor.fetchall()]

    # Mapeo de campos para compatibilidad con la interfaz
    for p in productos:
        p['name'] = p['nombre']
        p['brand'] = p['marca']
        p['category'] = p['categoria_slug']
        p['subcategory'] = p['subcategoria']
        p['price'] = float(p['precio'])
        p['originalPrice'] = float(p['precio_original']) if p['precio_original'] is not None else None
        p['description'] = p['descripcion']
        p['connectivity'] = p['conectividad']
        p['connectionLabel'] = p['etiqueta_conexion']
        p['popularity'] = p['popularidad']
        p['rgb'] = bool(p['rgb'])
        p['pickupVillahermosa'] = bool(p['retiro_villahermosa'])
        p['freeShipping'] = bool(p['envio_gratis'])
        p['targetAudience'] = p['publico']
        p['flashStock'] = p['stock_flash']
        p['dateAdded'] = p['fecha_alta']
        p['typeKey'] = p['tipo_ilustracion']
        p['variants'] = parse_variantes(p.get('variantes'))
        p['photoBase'], p['image'] = producto_image_paths(p['foto'])
        p['badge'] = None
        if p['precio_original'] and p['precio_original'] > p['precio']:
            desc_pct = round((1 - p['precio'] / p['precio_original']) * 100)
            p['badge'] = f"-{desc_pct}%"
        elif p['popularidad'] >= 97:
            p['badge'] = "MÁS VENDIDO"
        elif p['precio'] > 2000:
            p['badge'] = "PREMIUM"
        elif p['precio'] <= 800:
            p['badge'] = "ECONÓMICO"

    conn.close()
    return jsonify({"ok": True, "total": len(productos), "productos": productos})


@app.route('/api/productos/<int:prod_id>', methods=['GET'])
def get_producto_detalle(prod_id):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT p.*, c.nombre AS categoria_nombre, c.slug AS categoria_slug,
               ROUND(COALESCE(AVG(r.calificacion), 5.0), 1) AS rating,
               COUNT(r.id) AS reviewsCount
        FROM productos p
        JOIN categorias c ON p.categoria_id = c.id
        LEFT JOIN resenas r ON r.producto_id = p.id
        WHERE p.id = ? AND p.activo = 1
        GROUP BY p.id;
    """, (prod_id,))
    row = cursor.fetchone()

    if not row:
        conn.close()
        return jsonify({"ok": False, "error": "Producto no encontrado"}), 404

    producto = dict(row)
    producto['name'] = producto['nombre']
    producto['brand'] = producto['marca']
    producto['category'] = producto['categoria_slug']
    producto['subcategory'] = producto['subcategoria']
    producto['price'] = float(producto['precio'])
    producto['originalPrice'] = float(producto['precio_original']) if producto['precio_original'] is not None else None
    producto['description'] = producto['descripcion']
    producto['connectivity'] = producto['conectividad']
    producto['connectionLabel'] = producto['etiqueta_conexion']
    producto['popularity'] = producto['popularidad']
    producto['rgb'] = bool(producto['rgb'])
    producto['pickupVillahermosa'] = bool(producto['retiro_villahermosa'])
    producto['freeShipping'] = bool(producto['envio_gratis'])
    producto['targetAudience'] = producto['publico']
    producto['flashStock'] = producto['stock_flash']
    producto['dateAdded'] = producto['fecha_alta']
    producto['typeKey'] = producto['tipo_ilustracion']
    producto['variants'] = parse_variantes(producto.get('variantes'))
    producto['photoBase'], producto['image'] = producto_image_paths(producto['foto'])

    # Ficha técnica (producto_specs)
    cursor.execute("""
        SELECT etiqueta AS label, valor AS value
        FROM producto_specs
        WHERE producto_id = ?
        ORDER BY orden ASC;
    """, (prod_id,))
    producto['specs'] = [dict(s) for s in cursor.fetchall()]

    # Galería de fotos (producto_fotos)
    cursor.execute("""
        SELECT archivo, orden
        FROM producto_fotos
        WHERE producto_id = ?
        ORDER BY orden ASC;
    """, (prod_id,))
    producto['fotos'] = [dict(f) for f in cursor.fetchall()]

    # Reseñas del producto (resenas)
    cursor.execute("""
        SELECT id, autor, calificacion, comentario, creado_en, usuario_id
        FROM resenas
        WHERE producto_id = ?
        ORDER BY creado_en DESC;
    """, (prod_id,))
    producto['resenas'] = [dict(r) for r in cursor.fetchall()]

    conn.close()
    return jsonify({"ok": True, "producto": producto})


# ============================================================================
# API 3: RESEÑAS (CÁLCULO DINÁMICO DE CALIFICACIONES)
# ============================================================================

@app.route('/api/productos/<int:prod_id>/resenas', methods=['POST'])
def agregar_resena(prod_id):
    data = request.get_json() or {}
    autor = data.get('autor', '').strip()
    calificacion = int(data.get('calificacion', 5))
    comentario = data.get('comentario', '').strip()

    if not autor or not comentario:
        return jsonify({"ok": False, "error": "Autor y comentario son obligatorios"}), 400

    if not (1 <= calificacion <= 5):
        return jsonify({"ok": False, "error": "La calificación debe ser entre 1 y 5"}), 400

    usuario_id = session.get('usuario_id', None)
    ahora = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    conn = get_db()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            INSERT INTO resenas (producto_id, usuario_id, autor, calificacion, comentario, creado_en)
            VALUES (?, ?, ?, ?, ?, ?);
        """, (prod_id, usuario_id, autor, calificacion, comentario, ahora))
        conn.commit()

        # Recalcular nuevo promedio y conteo
        cursor.execute("""
            SELECT ROUND(AVG(calificacion), 1) AS nuevo_rating, COUNT(id) AS nuevo_conteo
            FROM resenas
            WHERE producto_id = ?;
        """, (prod_id,))
        stats = cursor.fetchone()

        conn.close()
        return jsonify({
            "ok": True,
            "mensaje": "¡Reseña registrada con éxito en SQLite!",
            "rating": stats['nuevo_rating'],
            "reviewsCount": stats['nuevo_conteo']
        })
    except Exception as e:
        conn.close()
        return jsonify({"ok": False, "error": str(e)}), 500


# ============================================================================
# API 4: CUPONES
# ============================================================================

@app.route('/api/cupones/validar', methods=['POST'])
def validar_cupon():
    data = request.get_json() or {}
    codigo = data.get('codigo', '').strip().upper()
    subtotal = float(data.get('subtotal', 0))

    if not codigo:
        return jsonify({"ok": False, "error": "Ingresa un código de cupón"}), 400

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, codigo, tipo, valor, activo, vence_en
        FROM cupones
        WHERE UPPER(codigo) = ? AND activo = 1;
    """, (codigo,))
    cupon = cursor.fetchone()
    conn.close()

    if not cupon:
        return jsonify({"ok": False, "error": "Cupón inválido o expirado"}), 404

    if cupon['codigo'].upper() == 'ESTUDIANTE10':
        user = get_session_user()
        if not user or not correo_es_estudiante(user.get('correo')):
            return jsonify({"ok": False, "error": "El cupón ESTUDIANTE10 es exclusivo para estudiantes UJAT. Inicia sesión con tu correo @alumno.ujat.mx."}), 403

    # Verificar fecha de vencimiento si existe
    if cupon['vence_en']:
        try:
            vence = datetime.datetime.strptime(cupon['vence_en'], "%Y-%m-%d")
            if datetime.datetime.now() > vence:
                return jsonify({"ok": False, "error": "Este cupón ha caducado"}), 400
        except Exception:
            pass

    descuento = 0.0
    if cupon['tipo'] == 'porcentaje':
        descuento = round(subtotal * (cupon['valor'] / 100.0), 2)
    elif cupon['tipo'] == 'monto':
        descuento = min(cupon['valor'], subtotal)

    return jsonify({
        "ok": True,
        "cupon": {
            "id": cupon['id'],
            "codigo": cupon['codigo'],
            "tipo": cupon['tipo'],
            "valor": cupon['valor'],
            "descuento": descuento
        }
    })


# ============================================================================
# API 4B: NEWSLETTER (SUSCRIPTORES)
# ============================================================================

@app.route('/api/newsletter/suscribir', methods=['POST'])
def suscribir_newsletter():
    data = request.get_json() or {}
    correo = (data.get('correo') or '').strip().lower()

    if not correo or '@' not in correo or '.' not in correo.split('@')[-1]:
        return jsonify({"ok": False, "error": "Ingresa un correo electrónico válido"}), 400

    ahora = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT OR IGNORE INTO suscriptores (correo, creado_en) VALUES (?, ?);",
            (correo, ahora)
        )
        conn.commit()
    finally:
        conn.close()

    return jsonify({
        "ok": True,
        "mensaje": "¡Suscripción registrada! Usa el cupón NEXUS100 en tu primera compra."
    })


# ============================================================================
# API 5: PEDIDOS Y CHECKOUT (TRANSACCIÓN ATÓMICA CON CONGELAMIENTO DE PRECIOS)
# ============================================================================

@app.route('/api/pedidos', methods=['POST'])
def crear_pedido():
    data = request.get_json() or {}

    nombre = data.get('nombre_contacto', '').strip()
    correo = data.get('correo_contacto', '').strip()
    telefono = data.get('telefono_contacto', '').strip()
    tipo_envio = data.get('tipo_envio', 'domicilio') # 'domicilio' o 'retiro_villahermosa'
    metodo_pago = data.get('metodo_pago', 'tarjeta') # 'tarjeta', 'oxxo', 'spei', 'contra_entrega'
    if metodo_pago == 'cod':
        metodo_pago = 'contra_entrega'
    meses_msi = int(data.get('meses_msi', 1))
    codigo_cupon = (data.get('codigo_cupon') or '').strip().upper()
    items = data.get('items', [])

    if not nombre or not correo or not telefono:
        return jsonify({"ok": False, "error": "Nombre, correo y teléfono son obligatorios"}), 400

    if not items:
        return jsonify({"ok": False, "error": "El pedido no contiene productos"}), 400

    if metodo_pago not in ('tarjeta', 'oxxo', 'spei', 'contra_entrega'):
        return jsonify({"ok": False, "error": "Método de pago no válido"}), 400

    conn = get_db()
    cursor = conn.cursor()

    try:
        # 1. Generar Folio Único (ej: NX-48213)
        folio = f"NX-{random.randint(10000, 99999)}"
        while True:
            cursor.execute("SELECT 1 FROM pedidos WHERE folio = ?;", (folio,))
            if not cursor.fetchone():
                break
            folio = f"NX-{random.randint(10000, 99999)}"

        # 2. Calcular Subtotal verificando precios y stock real en BD
        subtotal = 0.0
        items_validados = []

        for item in items:
            prod_id = int(item.get('producto_id'))
            cant = int(item.get('cantidad', 1))
            if cant <= 0:
                continue

            cursor.execute("SELECT id, nombre, precio, stock, variantes FROM productos WHERE id = ?;", (prod_id,))
            prod = cursor.fetchone()
            if not prod:
                raise ValueError(f"El producto #{prod_id} no existe.")

            if prod['stock'] < cant:
                raise ValueError(f"Stock insuficiente para '{prod['nombre']}'. Disponible: {prod['stock']}")

            variante_label, variante_extra = calcular_variante(
                parse_variantes(prod['variantes']), item.get('variante')
            )
            precio_unitario = float(prod['precio']) + variante_extra
            subtotal += precio_unitario * cant
            items_validados.append({
                "producto_id": prod['id'],
                "nombre_producto": prod['nombre'],
                "cantidad": cant,
                "precio_unitario": precio_unitario,
                "variante": variante_label
            })

            # Descontar stock
            cursor.execute("UPDATE productos SET stock = stock - ? WHERE id = ?;", (cant, prod['id']))

        # 3. Validar Cupón si fue proporcionado
        cupon_id = None
        descuento = 0.0
        if codigo_cupon:
            cursor.execute("SELECT id, tipo, valor FROM cupones WHERE UPPER(codigo) = ? AND activo = 1;", (codigo_cupon,))
            c_row = cursor.fetchone()
            if c_row:
                cupon_id = c_row['id']
                if codigo_cupon == 'ESTUDIANTE10':
                    user = get_session_user()
                    if not user or not correo_es_estudiante(user.get('correo')):
                        raise ValueError("El cupón ESTUDIANTE10 requiere una cuenta de estudiante UJAT (@alumno.ujat.mx)")
                if c_row['tipo'] == 'porcentaje':
                    descuento = round(subtotal * (c_row['valor'] / 100.0), 2)
                elif c_row['tipo'] == 'monto':
                    descuento = min(c_row['valor'], subtotal)

        # 4. Calcular costo de envío
        if tipo_envio == 'retiro_villahermosa' or subtotal >= 999:
            envio = 0.0
        else:
            envio = 149.0

        total = max(0.0, subtotal - descuento + envio)

        # 5. Estado y Guía iniciales
        if tipo_envio == 'retiro_villahermosa':
            estado = "Listo en Villahermosa"
            guia = None
        else:
            estado = "En camino vía FedEx"
            guia = f"FEDEX-{random.randint(1000000, 9999999)}"

        creado_en = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        usuario_id = session.get('usuario_id', data.get('usuario_id', None))
        if not usuario_id:
            cursor.execute("SELECT id FROM usuarios WHERE LOWER(correo) = ?;", (correo.lower(),))
            match = cursor.fetchone()
            if match:
                usuario_id = match['id']

        # 6. Insertar Pedido
        cursor.execute("""
            INSERT INTO pedidos (
                folio, usuario_id, nombre_contacto, correo_contacto, telefono_contacto,
                tipo_envio, calle, colonia, ciudad, estado_republica, cp, referencias, rfc,
                metodo_pago, meses_msi, cupon_id, subtotal, descuento, envio, total,
                estado, guia, creado_en
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        """, (
            folio, usuario_id, nombre, correo, telefono,
            tipo_envio,
            data.get('calle', ''),
            data.get('colonia', ''),
            data.get('ciudad', ''),
            data.get('estado', 'Tabasco'),
            data.get('cp', ''),
            data.get('referencias', ''),
            data.get('rfc', None),
            metodo_pago, meses_msi, cupon_id,
            subtotal, descuento, envio, total,
            estado, guia, creado_en
        ))
        pedido_id = cursor.lastrowid

        # 7. Insertar Partidas del Pedido (pedido_items) con precios congelados
        for it in items_validados:
            cursor.execute("""
                INSERT INTO pedido_items (pedido_id, producto_id, nombre_producto, cantidad, precio_unitario, variante)
                VALUES (?, ?, ?, ?, ?, ?);
            """, (pedido_id, it['producto_id'], it['nombre_producto'], it['cantidad'], it['precio_unitario'], it.get('variante')))

        conn.commit()
        conn.close()

        return jsonify({
            "ok": True,
            "folio": folio,
            "total": total,
            "subtotal": subtotal,
            "descuento": descuento,
            "envio": envio,
            "estado": estado,
            "guia": guia,
            "mensaje": f"Pedido #{folio} guardado exitosamente en SQLite."
        })

    except Exception as e:
        conn.rollback()
        conn.close()
        return jsonify({"ok": False, "error": str(e)}), 400


@app.route('/api/pedidos/<folio>', methods=['GET'])
def get_pedido_por_folio(folio):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM pedidos WHERE UPPER(folio) = UPPER(?);", (folio,))
    row = cursor.fetchone()

    if not row:
        conn.close()
        return jsonify({"ok": False, "error": "Pedido no encontrado"}), 404

    pedido = dict(row)
    cursor.execute("""
        SELECT pi.id, pi.producto_id, pi.nombre_producto, pi.cantidad, pi.precio_unitario, pi.variante,
               (pi.cantidad * pi.precio_unitario) AS total_renglon
        FROM pedido_items pi
        WHERE pi.pedido_id = ?;
    """, (pedido['id'],))
    pedido['items'] = [dict(i) for i in cursor.fetchall()]

    conn.close()
    return jsonify({"ok": True, "pedido": pedido})

@app.route('/api/pedidos/<int:pedido_id>/devolucion', methods=['POST'])
def solicitar_devolucion_pedido(pedido_id):
    usuario_id = session.get('usuario_id')
    if not usuario_id:
        return jsonify({"ok": False, "error": "Debes iniciar sesión para solicitar una devolución"}), 401

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM pedidos WHERE id = ?;", (pedido_id,))
    pedido = cursor.fetchone()
    if not pedido:
        conn.close()
        return jsonify({"ok": False, "error": "Pedido no encontrado"}), 404
    es_duenio = pedido['usuario_id'] == usuario_id
    if not es_duenio and pedido['usuario_id'] is None:
        user = get_session_user()
        es_duenio = bool(user) and (pedido['correo_contacto'] or '').lower() == (user.get('correo') or '').lower()
    if not es_duenio:
        conn.close()
        return jsonify({"ok": False, "error": "No puedes solicitar la devolución de este pedido"}), 403

    estado = pedido['estado']
    if estado in {'Cancelado', 'Reembolsado', 'Devuelto'}:
        conn.close()
        return jsonify({"ok": False, "error": "Este pedido ya fue cerrado y no admite otra devolución"}), 409
    if estado == 'Devolución solicitada':
        conn.close()
        return jsonify({"ok": True, "mensaje": "Ya tienes una solicitud de devolución en proceso", "estado": estado})
    if estado != 'Entregado':
        conn.close()
        return jsonify({"ok": False, "error": f"No se puede solicitar la devolución de un pedido en estado {estado}"}), 400

    cursor.execute("UPDATE pedidos SET estado = 'Devolución solicitada' WHERE id = ?;", (pedido['id'],))
    conn.commit()
    conn.close()
    return jsonify({
        "ok": True,
        "mensaje": "Solicitud de devolución registrada. Nuestro equipo revisará el pedido.",
        "estado": "Devolución solicitada",
        "folio": pedido['folio']
    })


# ============================================================================
# API 6: AUTENTICACIÓN Y CLIENTES
# ============================================================================

@app.route('/api/auth/register', methods=['POST'])
def auth_register():
    data = request.get_json() or {}
    nombre = data.get('nombre', '').strip()
    correo = data.get('correo', '').strip().lower()
    password = data.get('password', '').strip()
    telefono = data.get('telefono', '').strip()
    rol = (data.get('rol') or 'cliente').strip().lower()

    if rol not in ('cliente', 'vendedor'):
        return jsonify({"ok": False, "error": "Solo puedes registrarte como cliente o vendedor"}), 400

    if not nombre or not correo or not password:
        return jsonify({"ok": False, "error": "Nombre, correo y contraseña son obligatorios"}), 400

    conn = get_db()
    cursor = conn.cursor()

    # Verificar si el correo ya existe
    cursor.execute("SELECT id FROM usuarios WHERE correo = ?;", (correo,))
    if cursor.fetchone():
        conn.close()
        return jsonify({"ok": False, "error": "El correo ya está registrado"}), 409

    pw_hash = generate_password_hash(password)
    ahora = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    try:
        cursor.execute("""
            INSERT INTO usuarios (nombre, correo, password_hash, telefono, rol, creado_en)
            VALUES (?, ?, ?, ?, ?, ?);
        """, (nombre, correo, pw_hash, telefono, rol, ahora))
        usuario_id = cursor.lastrowid

        # Crear preferencias iniciales
        cursor.execute("""
            INSERT INTO preferencias (usuario_id, alertas_whatsapp, boletin)
            VALUES (?, 1, 1);
        """, (usuario_id,))

        conn.commit()
        session['usuario_id'] = usuario_id

        user_data = {
            "id": usuario_id,
            "nombre": nombre,
            "correo": correo,
            "telefono": telefono,
            "rol": rol,
            "es_estudiante": correo_es_estudiante(correo)
        }
        conn.close()
        return jsonify({"ok": True, "cliente": user_data, "mensaje": "Cuenta creada exitosamente en SQLite."})

    except Exception as e:
        conn.rollback()
        conn.close()
        return jsonify({"ok": False, "error": str(e)}), 500


@app.route('/api/auth/login', methods=['POST'])
def auth_login():
    data = request.get_json() or {}
    correo = data.get('correo', '').strip().lower()
    password = data.get('password', '').strip()

    if not correo or not password:
        return jsonify({"ok": False, "error": "Ingresa correo y contraseña"}), 400

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id, nombre, correo, password_hash, telefono, rol FROM usuarios WHERE correo = ?;", (correo,))
    user = cursor.fetchone()
    conn.close()

    if not user or not check_password_hash(user['password_hash'], password):
        return jsonify({"ok": False, "error": "Credenciales inválidas"}), 401

    session['usuario_id'] = user['id']
    return jsonify({
        "ok": True,
        "cliente": {
            "id": user['id'],
            "nombre": user['nombre'],
            "correo": user['correo'],
            "telefono": user['telefono'],
            "rol": user['rol'],
            "es_estudiante": correo_es_estudiante(user['correo'])
        }
    })


@app.route('/api/auth/me', methods=['GET'])
def auth_me():
    usuario_id = session.get('usuario_id')
    if not usuario_id:
        return jsonify({"ok": False, "autenticado": False})

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id, nombre, correo, telefono, rol FROM usuarios WHERE id = ?;", (usuario_id,))
    user = cursor.fetchone()

    if not user:
        conn.close()
        session.pop('usuario_id', None)
        return jsonify({"ok": False, "autenticado": False})

    cursor.execute("SELECT alertas_whatsapp, boletin FROM preferencias WHERE usuario_id = ?;", (usuario_id,))
    prefs = cursor.fetchone()
    conn.close()

    return jsonify({
        "ok": True,
        "autenticado": True,
        "cliente": {**dict(user), "es_estudiante": correo_es_estudiante(user['correo'])},
        "preferencias": dict(prefs) if prefs else {}
    })


@app.route('/api/auth/logout', methods=['POST'])
def auth_logout():
    session.pop('usuario_id', None)
    return jsonify({"ok": True, "mensaje": "Sesión cerrada"})


# ============================================================================
# API 7: CUENTA DE USUARIO (HISTORIAL DE PEDIDOS, DIRECCIONES Y PREFERENCIAS)
# ============================================================================

@app.route('/api/cuenta/pedidos', methods=['GET'])
def get_pedidos_cliente():
    usuario_id = session.get('usuario_id')
    if not usuario_id:
        return jsonify({"ok": True, "autenticado": False, "pedidos": []})

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT correo FROM usuarios WHERE id = ?;", (usuario_id,))
    user_row = cursor.fetchone()
    correo_usuario = user_row['correo'].lower() if user_row else ''

    cursor.execute("""
        SELECT p.id, p.folio, p.nombre_contacto, p.correo_contacto, p.tipo_envio,
               p.calle, p.colonia, p.ciudad, p.estado_republica, p.cp,
               p.metodo_pago, p.meses_msi, p.subtotal, p.descuento, p.envio, p.total,
               p.estado, p.guia, p.creado_en
        FROM pedidos p
        WHERE p.usuario_id = ? OR (p.usuario_id IS NULL AND LOWER(p.correo_contacto) = ?)
        ORDER BY p.id DESC;
    """, (usuario_id, correo_usuario))
    pedidos = [dict(p) for p in cursor.fetchall()]

    for ped in pedidos:
        cursor.execute("""
            SELECT pi.producto_id, pi.nombre_producto, pi.cantidad, pi.precio_unitario, pi.variante,
                   (pi.cantidad * pi.precio_unitario) AS subtotal
            FROM pedido_items pi
            WHERE pi.pedido_id = ?;
        """, (ped['id'],))
        ped['items'] = [dict(i) for i in cursor.fetchall()]
        ped['items_resumen'] = ", ".join([f"{it['cantidad']}x {it['nombre_producto']}" + (f" ({it['variante']})" if it.get('variante') else "") for it in ped['items']])

    conn.close()
    return jsonify({"ok": True, "autenticado": True, "pedidos": pedidos})


@app.route('/api/cuenta/direcciones', methods=['GET', 'POST'])
def manage_direcciones():
    usuario_id = session.get('usuario_id')
    if not usuario_id:
        if request.method == 'GET':
            return jsonify({"ok": True, "autenticado": False, "direcciones": []})
        return jsonify({"ok": False, "error": "Debes iniciar sesión para gestionar direcciones"}), 401

    conn = get_db()
    cursor = conn.cursor()

    if request.method == 'GET':
        cursor.execute("SELECT * FROM direcciones WHERE usuario_id = ? ORDER BY principal DESC, id ASC;", (usuario_id,))
        dirs = [dict(d) for d in cursor.fetchall()]
        conn.close()
        return jsonify({"ok": True, "autenticado": True, "direcciones": dirs})

    if request.method == 'POST':
        data = request.get_json() or {}
        calle = data.get('calle', '').strip()
        colonia = data.get('colonia', '').strip()
        ciudad = data.get('ciudad', '').strip()
        estado = data.get('estado', '').strip()
        cp = data.get('cp', '').strip()
        referencias = data.get('referencias', '').strip()
        principal = 1 if data.get('principal') else 0

        if not calle or not ciudad or not cp:
            conn.close()
            return jsonify({"ok": False, "error": "Calle, ciudad y código postal son requeridos"}), 400

        if principal == 1:
            cursor.execute("UPDATE direcciones SET principal = 0 WHERE usuario_id = ?;", (usuario_id,))

        cursor.execute("""
            INSERT INTO direcciones (usuario_id, calle, colonia, ciudad, estado, cp, referencias, principal)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?);
        """, (usuario_id, calle, colonia, ciudad, estado, cp, referencias, principal))
        conn.commit()
        conn.close()
        return jsonify({"ok": True, "mensaje": "Dirección agregada correctamente en SQLite."})


@app.route('/api/cuenta/preferencias', methods=['GET', 'PUT'])
def manage_preferencias():
    usuario_id = session.get('usuario_id')
    if not usuario_id:
        if request.method == 'GET':
            return jsonify({"ok": True, "autenticado": False, "preferencias": None})
        return jsonify({"ok": False, "error": "Debes iniciar sesión para guardar preferencias"}), 401

    conn = get_db()
    cursor = conn.cursor()

    if request.method == 'GET':
        cursor.execute("SELECT alertas_whatsapp, boletin FROM preferencias WHERE usuario_id = ?;", (usuario_id,))
        prefs = cursor.fetchone()
        conn.close()
        return jsonify({"ok": True, "autenticado": True, "preferencias": dict(prefs) if prefs else {"alertas_whatsapp": 1, "boletin": 1}})

    if request.method == 'PUT':
        data = request.get_json() or {}
        alertas = 1 if data.get('alertas_whatsapp') else 0
        boletin = 1 if data.get('boletin') else 0

        cursor.execute("""
            INSERT INTO preferencias (usuario_id, alertas_whatsapp, boletin)
            VALUES (?, ?, ?)
            ON CONFLICT(usuario_id) DO UPDATE SET
                alertas_whatsapp = excluded.alertas_whatsapp,
                boletin = excluded.boletin;
        """, (usuario_id, alertas, boletin))
        conn.commit()
        conn.close()
        return jsonify({"ok": True, "mensaje": "Preferencias actualizadas."})


@app.route('/api/cuenta', methods=['DELETE'])
def eliminar_cuenta():
    usuario_id = session.get('usuario_id')
    if not usuario_id:
        return jsonify({"ok": False, "error": "No has iniciado sesión"}), 401

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM usuarios WHERE id = ?;", (usuario_id,))
    conn.commit()
    conn.close()
    session.pop('usuario_id', None)
    return jsonify({"ok": True, "mensaje": "Cuenta eliminada correctamente."})

@app.route('/api/cuenta/perfil', methods=['PUT'])
def update_perfil():
    usuario_id = session.get('usuario_id')
    if not usuario_id:
        return jsonify({"ok": False, "error": "No has iniciado sesión"}), 401

    data = request.get_json() or {}
    nombre = data.get('nombre', '').strip()
    telefono = data.get('telefono', '').strip()

    if not nombre:
        return jsonify({"ok": False, "error": "El nombre completo es obligatorio"}), 400

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("UPDATE usuarios SET nombre = ?, telefono = ? WHERE id = ?;", (nombre, telefono, usuario_id))
    conn.commit()
    conn.close()
    return jsonify({"ok": True, "mensaje": "Datos personales actualizados exitosamente en SQLite."})


# ============================================================================
# API 8: FAVORITOS (LISTA DE DESEOS EN SQLITE)
# ============================================================================

@app.route('/api/favoritos', methods=['GET'])
def get_favoritos():
    usuario_id = session.get('usuario_id')
    if not usuario_id:
        return jsonify({"ok": True, "autenticado": False, "favoritos": [], "ids": []})

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT p.id, p.nombre, p.marca, p.precio, p.precio_original, p.foto,
               p.tipo_ilustracion, p.retiro_villahermosa,
               ROUND(COALESCE(AVG(r.calificacion), 5.0), 1) AS rating,
               COUNT(r.id) AS reviewsCount
        FROM favoritos f
        JOIN productos p ON f.producto_id = p.id
        LEFT JOIN resenas r ON r.producto_id = p.id
        WHERE f.usuario_id = ?
        GROUP BY p.id;
    """, (usuario_id,))
    rows = [dict(r) for r in cursor.fetchall()]
    conn.close()

    for p in rows:
        p['name'] = p['nombre']
        p['brand'] = p['marca']
        p['price'] = float(p['precio'])
        p['originalPrice'] = float(p['precio_original']) if p['precio_original'] is not None else None
        _, p['image'] = producto_image_paths(p['foto'])
        p['typeKey'] = p['tipo_ilustracion']

    return jsonify({"ok": True, "autenticado": True, "favoritos": rows, "ids": [p['id'] for p in rows]})


@app.route('/api/favoritos/<int:prod_id>', methods=['POST', 'DELETE'])
def toggle_favorito(prod_id):
    usuario_id = session.get('usuario_id')
    if not usuario_id:
        return jsonify({"ok": False, "error": "Inicia sesión para sincronizar favoritos con tu cuenta"}), 401

    conn = get_db()
    cursor = conn.cursor()

    if request.method == 'POST':
        cursor.execute("INSERT OR IGNORE INTO favoritos (usuario_id, producto_id) VALUES (?, ?);", (usuario_id, prod_id))
        conn.commit()
        conn.close()
        return jsonify({"ok": True, "mensaje": "Producto agregado a favoritos en SQLite."})

    if request.method == 'DELETE':
        cursor.execute("DELETE FROM favoritos WHERE usuario_id = ? AND producto_id = ?;", (usuario_id, prod_id))
        conn.commit()
        conn.close()
        return jsonify({"ok": True, "mensaje": "Producto removido de favoritos."})
        conn.commit()
        conn.close()
        return jsonify({"ok": True, "mensaje": "Producto removido de favoritos."})


# ============================================================================
# API 9: TICKETS DE SOPORTE
# ============================================================================

@app.route('/api/soporte/tickets', methods=['POST'])
def crear_ticket_soporte():
    data = request.get_json() or {}
    nombre = data.get('nombre', '').strip()
    correo = data.get('correo', '').strip()
    telefono = data.get('telefono', '').strip()
    asunto = data.get('asunto', '').strip()
    mensaje = data.get('mensaje', '').strip()

    if not nombre or not correo or not mensaje:
        return jsonify({"ok": False, "error": "Nombre, correo y mensaje son requeridos"}), 400

    ahora = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO tickets_soporte (nombre, correo, telefono, asunto, mensaje, atendido, creado_en)
        VALUES (?, ?, ?, ?, ?, 0, ?);
    """, (nombre, correo, telefono, asunto, mensaje, ahora))
    ticket_id = cursor.lastrowid
    conn.commit()
    conn.close()

    return jsonify({
        "ok": True,
        "ticket_id": f"TK-{ticket_id:04d}",
        "mensaje": f"Ticket #{ticket_id:04d} registrado en SQLite. ¡Te responderemos pronto!"
    })


# ============================================================================
# API 10: INSPECTOR Y VISOR DE BASE DE DATOS (PARA EXPOSICIÓN ESCOLAR)
# ============================================================================

@app.route('/api/bd/tablas', methods=['GET'])
def get_bd_tablas():
    """
    Retorna el resumen de las 13 tablas, columnas, tipos, llaves y cantidad de registros.
    Ideal para exponer ante el profesor y compañeros.
    """
    admin, error = require_admin()
    if error:
        return error

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name ASC;")
    tables = [r['name'] for r in cursor.fetchall()]

    resumen = []
    for t in tables:
        # Conteo
        cursor.execute(f"SELECT COUNT(*) AS total FROM {t};")
        total = cursor.fetchone()['total']

        # Columnas
        cursor.execute(f"PRAGMA table_info({t});")
        columnas = [dict(c) for c in cursor.fetchall()]

        # Llaves foráneas
        cursor.execute(f"PRAGMA foreign_key_list({t});")
        fks = [dict(fk) for fk in cursor.fetchall()]

        resumen.append({
            "tabla": t,
            "total_filas": total,
            "columnas": columnas,
            "llaves_foraneas": fks
        })

    conn.close()
    return jsonify({"ok": True, "total_tablas": len(resumen), "tablas": resumen})


@app.route('/api/bd/tabla/<nombre>', methods=['GET'])
def get_bd_tabla_filas(nombre):
    """
    Retorna las filas de cualquier tabla de la base de datos para ver los datos en vivo.
    """
    admin, error = require_admin()
    if error:
        return error

    conn = get_db()
    cursor = conn.cursor()

    # Validar nombre para evitar SQL injection
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name = ?;", (nombre,))
    if not cursor.fetchone():
        conn.close()
        return jsonify({"ok": False, "error": f"La tabla '{nombre}' no existe"}), 404

    cursor.execute(f"SELECT * FROM {nombre} LIMIT 100;")
    rows = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return jsonify({"ok": True, "tabla": nombre, "total": len(rows), "filas": rows})


@app.route('/api/bd/sql', methods=['POST'])
def ejecutar_sql_readonly():
    """
    Consola interactiva de consultas SELECT para la demostración académica.
    """
    admin, error = require_admin()
    if error:
        return error

    data = request.get_json() or {}
    sql = data.get('sql', '').strip()

    if not sql:
        return jsonify({"ok": False, "error": "Consulta SQL vacía"}), 400

    # Permitir únicamente consultas SELECT de lectura
    first_word = sql.split()[0].upper()
    if first_word not in ['SELECT', 'PRAGMA', 'EXPLAIN']:
        return jsonify({"ok": False, "error": "Por seguridad, solo se permiten consultas SELECT/PRAGMA en la consola de demostración"}), 403

    conn = get_db()
    cursor = conn.cursor()

    try:
        cursor.execute(sql)
        rows = [dict(r) for r in cursor.fetchall()]
        conn.close()
        return jsonify({"ok": True, "total": len(rows), "filas": rows})
    except Exception as e:
        conn.close()
        return jsonify({"ok": False, "error": str(e)}), 400




def producto_image_paths(foto):
    """Devuelve (photoBase, image) compatibles con productos antiguos y archivos subidos."""
    if not foto:
        return "", ""
    base = f"img/{foto}"
    tiene_extension = bool(os.path.splitext(foto)[1])
    photo_base = base.rsplit('.', 1)[0] if tiene_extension else base
    image = base if tiene_extension else f"{base}.jpg"
    return photo_base, image


# ============================================================================
# API 8: PANELES DE ADMINISTRADOR Y VENDEDOR
# ============================================================================

def require_panel_user(roles=('admin', 'vendedor')):
    user = get_session_user()
    if not user:
        return None, (jsonify({"ok": False, "error": "Debes iniciar sesión"}), 401)
    if user.get('rol') not in roles:
        return None, (jsonify({"ok": False, "error": "No tienes permiso para acceder a este panel"}), 403)
    return user, None


def panel_productos_where(user):
    if user.get('rol') == 'admin':
        return "", []
    return " AND p.vendedor_id = ?", [user['id']]


@app.route('/api/panel/<role>/resumen', methods=['GET'])
def panel_resumen(role):
    roles = {'admin': ('admin',), 'vendedor': ('admin', 'vendedor')}
    if role not in roles:
        return jsonify({"ok": False, "error": "Panel no válido"}), 404
    user, error = require_panel_user(roles[role])
    if error:
        return error

    conn = get_db()
    cursor = conn.cursor()
    where, params = panel_productos_where(user)
    cursor.execute(f"""
        SELECT COUNT(*) AS productos_total,
               SUM(CASE WHEN p.activo = 1 THEN 1 ELSE 0 END) AS productos_activos,
               COALESCE(SUM(p.stock), 0) AS stock_total,
               SUM(CASE WHEN p.stock <= 5 THEN 1 ELSE 0 END) AS stock_bajo
        FROM productos p WHERE 1=1{where};
    """, params)
    prod = dict(cursor.fetchone())

    cursor.execute("""
        SELECT COUNT(*) AS pedidos_total,
               SUM(CASE WHEN p.estado NOT IN ('Entregado', 'Cancelado', 'Reembolsado', 'Devuelto') THEN 1 ELSE 0 END) AS pedidos_pendientes,
               SUM(CASE WHEN p.estado = 'Entregado' THEN 1 ELSE 0 END) AS pedidos_entregados,
               COALESCE(SUM(CASE WHEN p.estado NOT IN ('Cancelado', 'Reembolsado', 'Devuelto') THEN p.total ELSE 0 END), 0) AS ventas_total
        FROM pedidos p;
    """)
    ped = dict(cursor.fetchone())

    cursor.execute("SELECT COUNT(*) AS total FROM usuarios")
    usuarios_total = cursor.fetchone()['total']
    cursor.execute("SELECT COUNT(*) AS total FROM resenas")
    resenas_total = cursor.fetchone()['total']
    cursor.execute("SELECT AVG(calificacion) AS promedio FROM resenas")
    row = cursor.fetchone()
    resenas_promedio = row['promedio'] if row else None
    conn.close()

    return jsonify({
        "ok": True,
        "rol": user['rol'],
        "resumen": {
            **prod,
            **ped,
            "usuarios_total": usuarios_total,
            "usuarios_nuevos_30d": 0,
            "resenas_total": resenas_total,
            "resenas_promedio": resenas_promedio
        }
    })


@app.route('/api/panel/<role>/productos', methods=['GET'])
def panel_productos(role):
    roles = {'admin': ('admin',), 'vendedor': ('admin', 'vendedor')}
    if role not in roles:
        return jsonify({"ok": False, "error": "Panel no válido"}), 404
    user, error = require_panel_user(roles[role])
    if error:
        return error

    conn = get_db()
    cursor = conn.cursor()
    where, params = panel_productos_where(user)
    cursor.execute(f"""
        SELECT p.id, p.categoria_id, p.nombre, p.marca, p.subcategoria, p.descripcion,
               p.precio, p.precio_original, p.stock, p.stock_flash, p.popularidad,
               p.activo, p.vendedor_id, p.conectividad, p.etiqueta_conexion, p.rgb,
               p.retiro_villahermosa, p.envio_gratis, p.publico, p.tipo_ilustracion, p.foto,
               c.nombre AS categoria_nombre, c.slug AS categoria_slug
        FROM productos p
        JOIN categorias c ON c.id = p.categoria_id
        WHERE 1=1{where}
        ORDER BY p.id DESC;
    """, params)
    productos = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return jsonify({"ok": True, "productos": productos})



@app.route('/api/panel/<role>/productos/foto', methods=['POST'])
def panel_subir_foto_producto(role):
    roles = {'admin': ('admin',), 'vendedor': ('admin', 'vendedor')}
    if role not in roles:
        return jsonify({"ok": False, "error": "Panel no válido"}), 404
    user, error = require_panel_user(roles[role])
    if error:
        return error

    archivo = request.files.get('foto')
    if not archivo or not archivo.filename:
        return jsonify({"ok": False, "error": "Selecciona una imagen"}), 400

    ext = os.path.splitext(archivo.filename)[1].lower()
    if ext not in ('.jpg', '.jpeg', '.png', '.webp', '.gif'):
        return jsonify({"ok": False, "error": "Formato no válido. Usa JPG, PNG, WEBP o GIF"}), 400

    nombre_seguro = secure_filename(archivo.filename) or f"producto{ext}"
    timestamp = datetime.datetime.now().strftime('%Y%m%d%H%M%S')
    nombre_final = f"producto_{timestamp}_{nombre_seguro}"
    ruta_img = os.path.join(FRONTEND_DIR, 'img')
    os.makedirs(ruta_img, exist_ok=True)
    archivo.save(os.path.join(ruta_img, nombre_final))
    return jsonify({"ok": True, "foto": nombre_final, "mensaje": "Imagen guardada"})

@app.route('/api/panel/<role>/productos', methods=['POST'])
def panel_crear_producto(role):
    roles = {'admin': ('admin',), 'vendedor': ('admin', 'vendedor')}
    if role not in roles:
        return jsonify({"ok": False, "error": "Panel no válido"}), 404
    user, error = require_panel_user(roles[role])
    if error:
        return error

    data = request.get_json() or {}
    nombre = (data.get('nombre') or '').strip()
    marca = (data.get('marca') or '').strip()
    try:
        categoria_id = int(data.get('categoria_id'))
        precio = float(data.get('precio'))
        stock = int(data.get('stock', 0))
    except (TypeError, ValueError):
        return jsonify({"ok": False, "error": "Categoría, precio y stock deben ser válidos"}), 400
    if not nombre or not marca or precio < 0 or stock < 0:
        return jsonify({"ok": False, "error": "Nombre, marca, precio y stock son obligatorios"}), 400

    vendedor_id = user['id'] if user['rol'] == 'vendedor' else (data.get('vendedor_id') or None)
    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT id FROM categorias WHERE id = ?;", (categoria_id,))
        if not cursor.fetchone():
            conn.close()
            return jsonify({"ok": False, "error": "La categoría seleccionada no existe"}), 400
        if vendedor_id:
            cursor.execute("SELECT id FROM usuarios WHERE id = ? AND rol IN ('admin', 'vendedor');", (vendedor_id,))
            if not cursor.fetchone():
                conn.close()
                return jsonify({"ok": False, "error": "El vendedor asignado no existe"}), 400

        ahora = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        cursor.execute("""
            INSERT INTO productos (
                categoria_id, nombre, marca, subcategoria, descripcion, precio, precio_original,
                vendedor_id, conectividad, etiqueta_conexion, rgb, retiro_villahermosa,
                envio_gratis, publico, tipo_ilustracion, stock, stock_flash, popularidad,
                fecha_alta, foto, activo
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1);
        """, (
            categoria_id, nombre, marca, data.get('subcategoria'), data.get('descripcion'),
            precio, data.get('precio_original'), vendedor_id, data.get('conectividad'),
            data.get('etiqueta_conconexion'), 1 if data.get('rgb') else 0,
            1 if data.get('retiro_villahermosa', True) else 0,
            1 if data.get('envio_gratis') else 0, data.get('publico', 'ambos'),
            data.get('tipo_ilustracion'), stock, int(data.get('stock_flash') or 0),
            int(data.get('popularidad') or 50), ahora, data.get('foto'),
        ))
        producto_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return jsonify({"ok": True, "id": producto_id, "mensaje": "Producto creado"}), 201
    except Exception as e:
        conn.rollback()
        conn.close()
        return jsonify({"ok": False, "error": str(e)}), 400


@app.route('/api/panel/<role>/productos/<int:prod_id>', methods=['PUT'])
def panel_actualizar_producto(role, prod_id):
    roles = {'admin': ('admin',), 'vendedor': ('admin', 'vendedor')}
    if role not in roles:
        return jsonify({"ok": False, "error": "Panel no válido"}), 404
    user, error = require_panel_user(roles[role])
    if error:
        return error

    data = request.get_json() or {}
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id, vendedor_id FROM productos WHERE id = ?;", (prod_id,))
    producto = cursor.fetchone()
    if not producto:
        conn.close()
        return jsonify({"ok": False, "error": "Producto no encontrado"}), 404
    if user['rol'] == 'vendedor' and producto['vendedor_id'] != user['id']:
        conn.close()
        return jsonify({"ok": False, "error": "Solo puedes modificar tus propios productos"}), 403

    updates = []
    params = []
    if 'categoria_id' in data:
        try:
            categoria_id = int(data.get('categoria_id'))
        except (TypeError, ValueError):
            conn.close()
            return jsonify({"ok": False, "error": "Categoría no válida"}), 400
        cursor.execute("SELECT id FROM categorias WHERE id = ?;", (categoria_id,))
        if not cursor.fetchone():
            conn.close()
            return jsonify({"ok": False, "error": "La categoría seleccionada no existe"}), 400

    allowed = {
        'categoria_id': 'categoria_id',
        'nombre': 'nombre', 'marca': 'marca', 'subcategoria': 'subcategoria',
        'descripcion': 'descripcion', 'precio': 'precio', 'precio_original': 'precio_original',
        'conectividad': 'conectividad', 'etiqueta_conexion': 'etiqueta_conexion',
        'rgb': 'rgb', 'retiro_villahermosa': 'retiro_villahermosa',
        'envio_gratis': 'envio_gratis', 'publico': 'publico',
        'tipo_ilustracion': 'tipo_ilustracion', 'stock': 'stock',
        'stock_flash': 'stock_flash', 'popularidad': 'popularidad', 'foto': 'foto'
    }
    for key, column in allowed.items():
        if key in data:
            updates.append(f"{column} = ?")
            params.append(data[key])
    if 'activo' in data:
        updates.append("activo = ?")
        params.append(1 if data.get('activo') else 0)
    if not updates:
        conn.close()
        return jsonify({"ok": False, "error": "No hay cambios para guardar"}), 400

    params.append(prod_id)
    try:
        cursor.execute(f"UPDATE productos SET {', '.join(updates)} WHERE id = ?;", params)
        conn.commit()
        conn.close()
        return jsonify({"ok": True, "mensaje": "Producto actualizado"})
    except Exception as e:
        conn.rollback()
        conn.close()
        return jsonify({"ok": False, "error": str(e)}), 400


@app.route('/api/panel/<role>/pedidos', methods=['GET'])
def panel_pedidos(role):
    roles = {'admin': ('admin',), 'vendedor': ('admin', 'vendedor')}
    if role not in roles:
        return jsonify({"ok": False, "error": "Panel no válido"}), 404
    user, error = require_panel_user(roles[role])
    if error:
        return error

    conn = get_db()
    cursor = conn.cursor()
    if user['rol'] == 'admin':
        cursor.execute("""
            SELECT p.id, p.folio, p.nombre_contacto, p.correo_contacto, p.total, p.estado, p.creado_en,
                   GROUP_CONCAT(pi.nombre_producto || ' x' || pi.cantidad, ', ') AS items_resumen
            FROM pedidos p
            LEFT JOIN pedido_items pi ON pi.pedido_id = p.id
            GROUP BY p.id
            ORDER BY p.id DESC
            LIMIT 100;
        """)
    else:
        cursor.execute("""
            SELECT p.id, p.folio, p.nombre_contacto, p.correo_contacto, p.total, p.estado, p.creado_en,
                   GROUP_CONCAT(pi.nombre_producto || ' x' || pi.cantidad, ', ') AS items_resumen
            FROM pedidos p
            JOIN pedido_items pi ON pi.pedido_id = p.id
            JOIN productos prod ON prod.id = pi.producto_id
            WHERE prod.vendedor_id = ?
            GROUP BY p.id
            ORDER BY p.id DESC
            LIMIT 100;
        """, (user['id'],))
    pedidos = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return jsonify({"ok": True, "pedidos": pedidos})


@app.route('/api/panel/admin/pedidos/<int:pedido_id>/estado', methods=['PUT'])
def panel_actualizar_estado_pedido(pedido_id):
    user, error = require_admin()
    if error:
        return error
    data = request.get_json() or {}
    estado = (data.get('estado') or '').strip()
    validos = {
        'Pagado', 'Preparando', 'Listo en Villahermosa', 'En camino vía FedEx',
        'Entregado', 'Devolución solicitada', 'Reembolsado', 'Devuelto', 'Cancelado'
    }
    if estado not in validos:
        return jsonify({"ok": False, "error": "Estado de pedido no válido"}), 400

    estados_restan_stock = {'Cancelado', 'Reembolsado', 'Devuelto'}
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT estado, stock_regresado FROM pedidos WHERE id = ?;", (pedido_id,))
    pedido = cursor.fetchone()
    if not pedido:
        conn.close()
        return jsonify({"ok": False, "error": "Pedido no encontrado"}), 404

    cursor.execute("UPDATE pedidos SET estado = ? WHERE id = ?;", (estado, pedido_id))
    stock_regresado = 0
    if estado in estados_restan_stock and not pedido['stock_regresado']:
        cursor.execute("""
            SELECT producto_id, cantidad
            FROM pedido_items
            WHERE pedido_id = ? AND producto_id IS NOT NULL;
        """, (pedido_id,))
        for item in cursor.fetchall():
            cursor.execute("UPDATE productos SET stock = stock + ? WHERE id = ?;", (item['cantidad'], item['producto_id']))
            stock_regresado += int(item['cantidad'] or 0)
        cursor.execute("UPDATE pedidos SET stock_regresado = 1 WHERE id = ?;", (pedido_id,))

    conn.commit()
    conn.close()
    mensaje = "Estado actualizado"
    if stock_regresado:
        mensaje += f" y se regresaron {stock_regresado} unidades al inventario"
    return jsonify({"ok": True, "mensaje": mensaje, "stock_regresado": stock_regresado})


@app.route('/api/panel/admin/usuarios', methods=['GET'])
def panel_usuarios():
    user, error = require_admin()
    if error:
        return error
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT c.id, c.nombre, c.correo, c.telefono, c.rol, c.creado_en,
               (SELECT COUNT(*) FROM pedidos p WHERE p.usuario_id = c.id) AS pedidos_total,
               (SELECT COALESCE(SUM(p.total), 0) FROM pedidos p WHERE p.usuario_id = c.id AND p.estado != 'Cancelado') AS ventas_total
        FROM usuarios c
        ORDER BY c.id DESC;
    """)
    usuarios = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return jsonify({"ok": True, "usuarios": usuarios})


# ============================================================================
# ARRANQUE DE LA APLICACIÓN
# ============================================================================

if __name__ == '__main__':
    # Asegurar que la base de datos esté lista
    init_db(force_recreate=False)
    print("=" * 65)
    print(" NEXUS GEAR MX - SERVIDOR ACTIVO CON BASE DE DATOS SQLITE")
    print(" Visita en tu navegador: http://localhost:5000")
    print(" Base de datos SQLite:   tienda.db (13 tablas en 3FN)")
    print("=" * 65)
    app.run(host='0.0.0.0', port=5000, debug=False)
