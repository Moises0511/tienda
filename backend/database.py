"""
============================================================================
NEXUS GEAR MX - GESTOR DE BASE DE DATOS SQLITE (database.py)
Capa de persistencia con PRAGMA foreign_keys = ON y seeding completo
============================================================================
"""

import os
import json
import sqlite3

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'tienda.db')
SCHEMA_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'schema.sql')

def get_db():
    """
    Retorna una conexión a SQLite con soporte de llaves foráneas activo
    y mapeo de filas a diccionarios (sqlite3.Row).
    """
    conn = sqlite3.connect(DB_PATH)
    conn.execute("PRAGMA foreign_keys = ON;")
    conn.row_factory = sqlite3.Row
    return conn

def init_db(force_recreate=False):
    """
    Crea las tablas según schema.sql e inserta los datos iniciales
    de catálogo y operación demo, sin usuarios predeterminados.
    Las cuentas se crean mediante /api/auth/register.
    """
    if force_recreate and os.path.exists(DB_PATH):
        try:
            os.remove(DB_PATH)
            print("[-] Base de datos anterior eliminada para recreación limpia.")
        except Exception as e:
            print(f"[!] No se pudo eliminar la BD previa: {e}")

    conn = get_db()
    cursor = conn.cursor()

    # Migrar bases existentes: renombrar clientes -> usuarios y
    # cliente_id -> usuario_id sin perder datos ni llaves foráneas.
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name IN ('clientes','usuarios')")
    tablas_auth = {row['name'] for row in cursor.fetchall()}
    if 'clientes' in tablas_auth and 'usuarios' not in tablas_auth:
        cursor.execute("PRAGMA foreign_keys = OFF")
        cursor.execute("ALTER TABLE clientes RENAME TO usuarios")
        cursor.execute("PRAGMA foreign_keys = ON")

    cursor.execute("SELECT sql FROM sqlite_master WHERE type='table' AND name='usuarios'")
    row = cursor.fetchone()
    usuarios_sql = row['sql'] if row else ''
    if usuarios_sql and "'vendedor'" not in usuarios_sql:
        cursor.execute("PRAGMA foreign_keys = OFF")
        cursor.execute("DROP TABLE IF EXISTS usuarios_migrada")
        cursor.execute("""
            CREATE TABLE usuarios_migrada (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                correo TEXT NOT NULL UNIQUE,
                password_hash TEXT NOT NULL,
                telefono TEXT,
                rol TEXT DEFAULT 'cliente' CHECK (rol IN ('cliente', 'admin', 'vendedor')),
                creado_en TEXT NOT NULL
            )
        """)
        cursor.execute("INSERT INTO usuarios_migrada (id, nombre, correo, password_hash, telefono, rol, creado_en) SELECT id, nombre, correo, password_hash, telefono, rol, creado_en FROM usuarios")
        cursor.execute("DROP TABLE usuarios")
        cursor.execute("ALTER TABLE usuarios_migrada RENAME TO usuarios")
        cursor.execute("PRAGMA foreign_keys = ON")

    for tabla in ('direcciones', 'preferencias', 'pedidos', 'favoritos', 'resenas'):
        cursor.execute(f"PRAGMA table_info({tabla})")
        cols = {row['name'] for row in cursor.fetchall()}
        if 'cliente_id' in cols and 'usuario_id' not in cols:
            cursor.execute(f"ALTER TABLE {tabla} RENAME COLUMN cliente_id TO usuario_id")

    # Ejecutar DDL
    with open(SCHEMA_PATH, 'r', encoding='utf-8') as f:
        schema_sql = f.read()
    cursor.executescript(schema_sql)

    # Migraciones ligeras para bases de datos ya existentes
    cursor.execute("PRAGMA table_info(productos)")
    producto_cols = {row['name'] for row in cursor.fetchall()}
    if 'vendedor_id' not in producto_cols:
        cursor.execute("ALTER TABLE productos ADD COLUMN vendedor_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_productos_vendedor ON productos(vendedor_id)")

    if 'variantes' not in producto_cols:
        cursor.execute("ALTER TABLE productos ADD COLUMN variantes TEXT")

    cursor.execute("PRAGMA table_info(pedidos)")
    pedido_cols = {row['name'] for row in cursor.fetchall()}
    if 'stock_regresado' not in pedido_cols:
        cursor.execute("ALTER TABLE pedidos ADD COLUMN stock_regresado INTEGER DEFAULT 0")

    # La columna variante de pedido_items se agrega de forma aditiva.
    cursor.execute("PRAGMA table_info(pedido_items)")
    item_cols = {row['name'] for row in cursor.fetchall()}
    if 'variante' not in item_cols:
        cursor.execute("ALTER TABLE pedido_items ADD COLUMN variante TEXT")

    # 'spei' no puede agregarse con ALTER porque el CHECK de metodo_pago
    # está incrustado en la tabla; se recrea conservando todos los datos.
    cursor.execute("SELECT sql FROM sqlite_master WHERE type='table' AND name='pedidos'")
    row = cursor.fetchone()
    pedidos_sql = row['sql'] if row else ''
    if pedidos_sql and "'spei'" not in pedidos_sql:
        cursor.execute("PRAGMA foreign_keys = OFF")
        cursor.execute("DROP TABLE IF EXISTS pedidos_migrada")
        cursor.execute("""
            CREATE TABLE pedidos_migrada (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                folio TEXT NOT NULL UNIQUE,
                usuario_id INTEGER,
                nombre_contacto TEXT NOT NULL,
                correo_contacto TEXT NOT NULL,
                telefono_contacto TEXT NOT NULL,
                tipo_envio TEXT NOT NULL CHECK (tipo_envio IN ('domicilio', 'retiro_villahermosa')),
                calle TEXT,
                colonia TEXT,
                ciudad TEXT,
                estado_republica TEXT,
                cp TEXT,
                referencias TEXT,
                rfc TEXT,
                metodo_pago TEXT NOT NULL CHECK (metodo_pago IN ('tarjeta', 'oxxo', 'spei', 'contra_entrega')),
                meses_msi INTEGER DEFAULT 1 CHECK (meses_msi IN (1, 3, 6)),
                cupon_id INTEGER,
                subtotal REAL NOT NULL CHECK (subtotal >= 0),
                descuento REAL DEFAULT 0 CHECK (descuento >= 0),
                envio REAL DEFAULT 0 CHECK (envio >= 0),
                total REAL NOT NULL CHECK (total >= 0),
                estado TEXT NOT NULL DEFAULT 'Pagado',
                stock_regresado INTEGER DEFAULT 0 CHECK (stock_regresado IN (0, 1)),
                guia TEXT,
                creado_en TEXT NOT NULL,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
                FOREIGN KEY (cupon_id) REFERENCES cupones(id) ON DELETE SET NULL
            )
        """)
        cursor.execute("""
            INSERT INTO pedidos_migrada (
                id, folio, usuario_id, nombre_contacto, correo_contacto, telefono_contacto,
                tipo_envio, calle, colonia, ciudad, estado_republica, cp, referencias, rfc,
                metodo_pago, meses_msi, cupon_id, subtotal, descuento, envio, total,
                estado, stock_regresado, guia, creado_en
            )
            SELECT id, folio, usuario_id, nombre_contacto, correo_contacto, telefono_contacto,
                   tipo_envio, calle, colonia, ciudad, estado_republica, cp, referencias, rfc,
                   metodo_pago, meses_msi, cupon_id, subtotal, descuento, envio, total,
                   estado, stock_regresado, guia, creado_en
            FROM pedidos;
        """)
        cursor.execute("DROP TABLE pedidos")
        cursor.execute("ALTER TABLE pedidos_migrada RENAME TO pedidos")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_pedidos_usuario ON pedidos(usuario_id)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_pedidos_folio ON pedidos(folio)")
        cursor.execute("PRAGMA foreign_keys = ON")

    # Semilla inicial de variantes para teclados y mouses; solo rellena
    # productos que aún no tienen variantes definidas.
    teclado_variantes = json.dumps({
        "Tipo de Switch": {
            "Red (Lineal silencioso)": 0,
            "Brown (Táctil)": 0,
            "Blue (Clicky)": 150
        },
        "Color del Chasis": {
            "Negro Obsidiana": 0,
            "Blanco Ártico": 0,
            "Cyber Purple": 50
        }
    }, ensure_ascii=False)
    mouse_variantes = json.dumps({
        "Color": {
            "Negro": 0,
            "Blanco": 0
        },
        "Formato": {
            "Ambidiestro": 0,
            "Ergonómico para diestros": 0
        }
    }, ensure_ascii=False)
    cursor.execute("UPDATE productos SET variantes = ? WHERE variantes IS NULL AND tipo_ilustracion = 'keyboard';", (teclado_variantes,))
    cursor.execute("UPDATE productos SET variantes = ? WHERE variantes IS NULL AND tipo_ilustracion = 'mouse';", (mouse_variantes,))
    conn.commit()

    # Verificar si ya existen productos para evitar duplicar en arranques subsecuentes
    cursor.execute("SELECT COUNT(*) AS total FROM productos")
    if cursor.fetchone()['total'] > 0:
        print("[+] Base de datos ya inicializada con productos.")
        conn.close()
        return

    print("[*] Sembrando datos iniciales en SQLite...")

    # 1. CATEGORÍAS
    categorias_data = [
        ("Audífonos & Audio", "audifonos"),
        ("Teclados Mecánicos", "teclados"),
        ("Mouses Gaming", "mouses"),
        ("Mousepads XXL", "mousepads"),
        ("Streaming & Setup", "streaming"),
        ("Mochilas & Merch Tech", "merch")
    ]
    cursor.executemany(
        "INSERT INTO categorias (nombre, slug) VALUES (?, ?);",
        categorias_data
    )
    conn.commit()

    # Mapeo de slug a id
    cursor.execute("SELECT id, slug FROM categorias;")
    cat_map = {row['slug']: row['id'] for row in cursor.fetchall()}

    # 2. PRODUCTOS
    # Datos extraídos fielmente de PRODUCTS_DATA de app.js
    productos_seed = [
        {
            "id": 1,
            "categoria_slug": "audifonos",
            "nombre": "Audífonos Gamer Inalámbricos Logitech G435 LIGHTSPEED + Bluetooth",
            "marca": "Logitech G",
            "subcategoria": "Inalámbricos",
            "descripcion": "Audífonos inalámbricos ultraligeros de solo 165 g con doble conexión: receptor USB-A LIGHTSPEED de baja latencia o Bluetooth. Drivers de 40 mm, micrófonos beamforming integrados que reducen el ruido de fondo, compatibles con Dolby Atmos y hasta 18 horas de batería. Funcionan con PC, Mac, PS5, PS4, Nintendo Switch y celular.",
            "precio": 639.0,
            "precio_original": 959.0,
            "conectividad": "Inalámbrico",
            "etiqueta_conexion": "LIGHTSPEED 2.4 GHz + Bluetooth",
            "rgb": 0,
            "retiro_villahermosa": 1,
            "envio_gratis": 1,
            "publico": "gamer",
            "tipo_ilustracion": "headset",
            "stock": 14,
            "stock_flash": 4,
            "popularidad": 98,
            "fecha_alta": "2026-03-15",
            "foto": "logitech-g435-lightspeed",
            "specs": [
                ("Drivers", "40 mm", 1),
                ("Conexión", "LIGHTSPEED 2.4 GHz (receptor USB-A) y Bluetooth, hasta 10 m", 2),
                ("Batería", "Hasta 18 horas (carga por USB-C)", 3),
                ("Micrófono", "Dos micrófonos beamforming integrados, no desmontables", 4),
                ("Peso", "165 g", 5),
                ("Compatibilidad", "PC, Mac, PS5, PS4, Nintendo Switch y celular", 6)
            ],
            "fotos": ["logitech-g435-lightspeed.jpg"]
        },
        {
            "id": 2,
            "categoria_slug": "teclados",
            "nombre": "Teclado Mecánico 65% Hot-Swap Royal Kludge RK68 Bluetooth",
            "marca": "Royal Kludge",
            "subcategoria": "65% Compacto",
            "descripcion": "Teclado mecánico compacto 65% de 68 teclas con flechas independientes y switches intercambiables sin soldar (hot-swap). Se conecta por Bluetooth 5.0 o por cable USB-C y tiene software de personalización. Distribución ANSI (inglés), sin tecla Ñ.",
            "precio": 1127.0,
            "precio_original": None,
            "conectividad": "Inalámbrico",
            "etiqueta_conexion": "Bluetooth 5.0 / USB-C",
            "rgb": 1,
            "retiro_villahermosa": 1,
            "envio_gratis": 1,
            "publico": "estudiante",
            "tipo_ilustracion": "keyboard",
            "stock": 20,
            "stock_flash": 6,
            "popularidad": 95,
            "fecha_alta": "2026-03-20",
            "foto": "royal-kludge-rk68",
            "specs": [
                ("Distribución", "65%, 68 teclas con flechas y teclas de control independientes", 1),
                ("Conexión", "Bluetooth 5.0 y cable USB-C", 2),
                ("Switches", "Hot-swap (3 y 5 pines); disponible con switches Red, Brown o Blue", 3),
                ("Batería", "1450 mAh (versión Bluetooth)", 4),
                ("Keycaps", "ABS doble inyección, distribución ANSI (sin Ñ)", 5)
            ],
            "fotos": ["royal-kludge-rk68.jpg"]
        },
        {
            "id": 3,
            "categoria_slug": "mouses",
            "nombre": "Mouse Gamer Inalámbrico Ultraligero Razer Orochi V2",
            "marca": "Razer",
            "subcategoria": "Ultraligeros",
            "descripcion": "Mouse inalámbrico compacto y simétrico de menos de 60 g (sin pila) con sensor óptico Razer Focus X de 18,000 DPI, switches mecánicos de 2.ª generación para 60 millones de clics y conexión dual HyperSpeed 2.4 GHz o Bluetooth. Funciona con una sola pila AA y alcanza hasta 950 horas en modo Bluetooth.",
            "precio": 1799.0,
            "precio_original": None,
            "conectividad": "Inalámbrico",
            "etiqueta_conexion": "HyperSpeed 2.4 GHz + Bluetooth",
            "rgb": 0,
            "retiro_villahermosa": 1,
            "envio_gratis": 1,
            "publico": "gamer",
            "tipo_ilustracion": "mouse",
            "stock": 12,
            "stock_flash": 5,
            "popularidad": 94,
            "fecha_alta": "2026-04-01",
            "foto": "razer-orochi-v2",
            "specs": [
                ("Sensor", "Óptico Razer Focus X, 18,000 DPI", 1),
                ("Peso", "Menos de 60 g (sin pila)", 2),
                ("Botones", "6 programables (software Razer Synapse)", 3),
                ("Switches", "Mecánicos Razer de 2.ª generación, 60 millones de clics", 4),
                ("Conexión", "HyperSpeed 2.4 GHz (receptor USB) y Bluetooth", 5),
                ("Batería", "1 pila AA: hasta 425 h en 2.4 GHz o 950 h en Bluetooth", 6)
            ],
            "fotos": ["razer-orochi-v2.jpg"]
        },
        {
            "id": 4,
            "categoria_slug": "mousepads",
            "nombre": "Mousepad Gamer XXL Razer Gigantus V2 940 x 410 mm",
            "marca": "Razer",
            "subcategoria": "XXL Extended",
            "descripcion": "Alfombrilla extendida de tela microtejida texturizada, optimizada para todos los sensores de mouse, con espuma de goma de alta densidad de 4 mm y base antideslizante. Su tamaño XXL cubre teclado y mouse.",
            "precio": 969.0,
            "precio_original": None,
            "conectividad": "Sin conexión",
            "etiqueta_conexion": "Sin cables",
            "rgb": 0,
            "retiro_villahermosa": 1,
            "envio_gratis": 0,
            "publico": "estudiante",
            "tipo_ilustracion": "mousepad",
            "stock": 25,
            "stock_flash": 9,
            "popularidad": 91,
            "fecha_alta": "2026-01-10",
            "foto": "razer-gigantus-v2-xxl",
            "specs": [
                ("Dimensiones", "940 x 410 x 4 mm (XXL)", 1),
                ("Superficie", "Tela microtejida texturizada, suave", 2),
                ("Base", "Espuma de goma de alta densidad, antideslizante", 3),
                ("Iluminación", "No", 4)
            ],
            "fotos": ["razer-gigantus-v2-xxl.jpg"]
        },
        {
            "id": 5,
            "categoria_slug": "audifonos",
            "nombre": "Audífonos Gamer HyperX Cloud II 7.1 con Cable",
            "marca": "HyperX",
            "subcategoria": "Alámbricos",
            "descripcion": "Audífonos circumaurales con cable y estructura de aluminio. Transductores dinámicos de 53 mm, sonido envolvente virtual 7.1 con la caja de control USB incluida y micrófono desmontable con cancelación de ruido. Se conectan por USB o por jack de 3.5 mm a PC, PS5, PS4, Xbox, Switch y celular.",
            "precio": 1599.0,
            "precio_original": 1999.0,
            "conectividad": "Alámbrico",
            "etiqueta_conexion": "USB + jack 3.5 mm",
            "rgb": 0,
            "retiro_villahermosa": 1,
            "envio_gratis": 1,
            "publico": "gamer",
            "tipo_ilustracion": "headset",
            "stock": 18,
            "stock_flash": 3,
            "popularidad": 97,
            "fecha_alta": "2026-01-20",
            "foto": "hyperx-cloud-ii",
            "specs": [
                ("Transductores", "Dinámicos de 53 mm con imanes de neodimio", 1),
                ("Conexión", "USB (caja de control) y jack de 3.5 mm", 2),
                ("Sonido envolvente", "Virtual 7.1 con la caja de control USB", 3),
                ("Micrófono", "Desmontable, unidireccional, con cancelación de ruido", 4),
                ("Almohadillas", "Espuma viscoelástica (memory foam)", 5),
                ("Peso", "Aprox. 320 g", 6)
            ],
            "fotos": ["hyperx-cloud-ii.jpg"]
        },
        {
            "id": 6,
            "categoria_slug": "teclados",
            "nombre": "Teclado Mecánico Inalámbrico Keychron K2 V2 Hot-Swap",
            "marca": "Keychron",
            "subcategoria": "75% Formato",
            "descripcion": "Teclado mecánico compacto 75% (84 teclas) con marco de aluminio y switches Gateron G Pro intercambiables sin soldar (hot-swap). Funciona en Mac y Windows: Bluetooth 5.1 con hasta 3 dispositivos o por cable USB-C. Su batería de 4000 mAh rinde hasta 240 horas con la iluminación apagada.",
            "precio": 2199.0,
            "precio_original": 2499.0,
            "conectividad": "Inalámbrico",
            "etiqueta_conexion": "Bluetooth 5.1 / USB-C",
            "rgb": 1,
            "retiro_villahermosa": 0,
            "envio_gratis": 1,
            "publico": "estudiante",
            "tipo_ilustracion": "keyboard",
            "stock": 8,
            "stock_flash": 2,
            "popularidad": 93,
            "fecha_alta": "2026-02-28",
            "foto": "keychron-k2-v2",
            "specs": [
                ("Distribución", "75% (84 teclas)", 1),
                ("Conexión", "Bluetooth 5.1 (hasta 3 dispositivos) y cable USB-C", 2),
                ("Switches", "Gateron G Pro Brown (táctiles), hot-swap", 3),
                ("Batería", "4000 mAh, hasta 240 h sin iluminación", 4),
                ("Construcción", "Marco de aluminio", 5)
            ],
            "fotos": ["keychron-k2-v2.jpg"]
        },
        {
            "id": 7,
            "categoria_slug": "mouses",
            "nombre": "Mouse Gamer Logitech G502 HERO High Performance",
            "marca": "Logitech G",
            "subcategoria": "Ergonómicos",
            "descripcion": "Mouse gamer alámbrico para diestros con sensor óptico HERO (100 a 25,600 DPI), 11 botones programables, iluminación RGB LIGHTSYNC y 5 pesas de 3.6 g para ajustar peso y balance. Cable trenzado de 2.1 m con conector USB-A.",
            "precio": 999.0,
            "precio_original": 1299.0,
            "conectividad": "Alámbrico",
            "etiqueta_conexion": "USB-A",
            "rgb": 1,
            "retiro_villahermosa": 1,
            "envio_gratis": 1,
            "publico": "gamer",
            "tipo_ilustracion": "mouse",
            "stock": 22,
            "stock_flash": 7,
            "popularidad": 96,
            "fecha_alta": "2026-01-05",
            "foto": "logitech-g502-hero",
            "specs": [
                ("Sensor", "HERO, 100 a 25,600 DPI", 1),
                ("Botones", "11 programables (Logitech G HUB)", 2),
                ("Peso", "121 g (+ hasta 18 g con 5 pesas)", 3),
                ("Conexión", "USB-A, cable trenzado de 2.1 m", 4),
                ("Iluminación", "RGB LIGHTSYNC", 5)
            ],
            "fotos": ["logitech-g502-hero.jpg"]
        },
        {
            "id": 8,
            "categoria_slug": "mousepads",
            "nombre": "Mousepad Gamer RGB Corsair MM700 Extended XL 930 x 400 mm",
            "marca": "Corsair",
            "subcategoria": "RGB Iluminado",
            "descripcion": "Alfombrilla extendida de tela con iluminación RGB de 360° en tres zonas y 12 perfiles integrados, personalizable con el software iCUE. Incluye un hub USB de 2 puertos y se conecta con un cable USB-C desmontable. Base de goma antideslizante de 4 mm.",
            "precio": 999.0,
            "precio_original": 1299.0,
            "conectividad": "Alámbrico",
            "etiqueta_conexion": "USB-C desmontable a USB-A",
            "rgb": 1,
            "retiro_villahermosa": 1,
            "envio_gratis": 0,
            "publico": "gamer",
            "tipo_ilustracion": "mousepad",
            "stock": 16,
            "stock_flash": 8,
            "popularidad": 85,
            "fecha_alta": "2026-03-01",
            "foto": "corsair-mm700-rgb-extended",
            "specs": [
                ("Dimensiones", "930 x 400 x 4 mm (Extended XL)", 1),
                ("Iluminación", "RGB de 360° en 3 zonas, software iCUE", 2),
                ("Hub USB", "2 puertos USB-A", 3),
                ("Conexión", "Cable USB-C desmontable", 4)
            ],
            "fotos": ["corsair-mm700-rgb-extended.jpg"]
        },
        {
            "id": 9,
            "categoria_slug": "streaming",
            "nombre": "Micrófono USB de Condensador HyperX SoloCast",
            "marca": "HyperX",
            "subcategoria": "Micrófonos",
            "descripcion": "Micrófono USB de condensador electret con patrón cardioide que prioriza tu voz frente al micrófono. Plug and play sin drivers, sensor táctil para silenciar con indicador LED y soporte ajustable compatible con brazos de micrófono. Funciona con PC, Mac, PS4 y PS5.",
            "precio": 1499.0,
            "precio_original": None,
            "conectividad": "Alámbrico",
            "etiqueta_conexion": "USB-C a USB-A",
            "rgb": 0,
            "retiro_villahermosa": 1,
            "envio_gratis": 1,
            "publico": "estudiante",
            "tipo_ilustracion": "mic",
            "stock": 11,
            "stock_flash": 4,
            "popularidad": 89,
            "fecha_alta": "2026-03-25",
            "foto": "hyperx-solocast",
            "specs": [
                ("Elemento", "Cápsula de condensador electret de 14 mm", 1),
                ("Patrón polar", "Cardioide", 2),
                ("Resolución", "Hasta 24 bits / 96 kHz", 3),
                ("Conexión", "USB-C a USB-A plug and play", 4),
                ("Silenciar", "Sensor táctil con indicador LED", 5)
            ],
            "fotos": ["hyperx-solocast.jpg"]
        },
        {
            "id": 10,
            "categoria_slug": "streaming",
            "nombre": "Barra de Luz para Monitor Xiaomi Mi Computer Monitor Light Bar",
            "marca": "Xiaomi",
            "subcategoria": "Iluminación Desk",
            "descripcion": "Barra de luz LED con óptica asimétrica que ilumina tu escritorio sin generar reflejos en la pantalla. Temperatura de color de 2700 K a 6500 K y brillo ajustable del 10% al 100% con un control remoto inalámbrico de perilla. Cuerpo de aluminio con rotación magnética.",
            "precio": 949.0,
            "precio_original": 1199.0,
            "conectividad": "Alámbrico",
            "etiqueta_conexion": "USB-C a USB-A",
            "rgb": 0,
            "retiro_villahermosa": 1,
            "envio_gratis": 0,
            "publico": "estudiante",
            "tipo_ilustracion": "lamp",
            "stock": 15,
            "stock_flash": 5,
            "popularidad": 92,
            "fecha_alta": "2026-02-14",
            "foto": "xiaomi-monitor-light-bar",
            "specs": [
                ("Temperatura de color", "2700 K a 6500 K", 1),
                ("Potencia", "5 W (5 V / 1 A)", 2),
                ("Control", "Perilla inalámbrica de 2.4 GHz (2 pilas AAA)", 3),
                ("Alimentación", "USB-C", 4),
                ("CRI", "Ra95 (reproducción cromática fiel)", 5)
            ],
            "fotos": ["xiaomi-monitor-light-bar.jpg"]
        },
        {
            "id": 11,
            "categoria_slug": "merch",
            "nombre": "Mochila para Laptop Razer Rogue 17 pulgadas Backpack V3",
            "marca": "Razer",
            "subcategoria": "Mochilas & Fundas",
            "descripcion": "Mochila con compartimento para laptops de hasta 17.3 pulgadas, exterior resistente al desgarro y al agua con funda para lluvia, interior acolchado de TPU a prueba de rayones y compartimentos separados que protegen tu equipo universitario y periféricos.",
            "precio": 2261.0,
            "precio_original": None,
            "conectividad": "Sin conexión",
            "etiqueta_conexion": "Sin cables",
            "rgb": 0,
            "retiro_villahermosa": 1,
            "envio_gratis": 0,
            "publico": "estudiante",
            "tipo_ilustracion": "backpack",
            "stock": 10,
            "stock_flash": 10,
            "popularidad": 88,
            "fecha_alta": "2026-02-01",
            "foto": "razer-rogue-17-v3",
            "specs": [
                ("Laptop compatible", "Hasta 17.3 pulgadas", 1),
                ("Exterior", "Resistente al desgarro con funda para lluvia", 2),
                ("Interior", "Acolchado de TPU a prueba de rayones", 3),
                ("Cierres", "Cremalleras reforzadas e impermeables", 4)
            ],
            "fotos": ["razer-rogue-17-v3.jpg"]
        },
        {
            "id": 12,
            "categoria_slug": "teclados",
            "nombre": "Teclado Gamer Mecánico Redragon Kumara K552 RGB",
            "marca": "Redragon",
            "subcategoria": "TKL Compacto",
            "descripcion": "Teclado mecánico compacto TKL de 87 teclas con switches Outemu Blue (táctiles con clic audible), estructura de metal y ABS, retroiluminación RGB con 18 modos, anti-ghosting con N-key rollover y diseño resistente a salpicaduras. Cable USB-A de 1.8 m.",
            "precio": 799.0,
            "precio_original": 999.0,
            "conectividad": "Alámbrico",
            "etiqueta_conexion": "USB-A",
            "rgb": 1,
            "retiro_villahermosa": 1,
            "envio_gratis": 0,
            "publico": "gamer",
            "tipo_ilustracion": "keyboard",
            "stock": 30,
            "stock_flash": 8,
            "popularidad": 90,
            "fecha_alta": "2026-01-15",
            "foto": "redragon-k552-kumara",
            "specs": [
                ("Switches", "Outemu Blue (clic audible)", 1),
                ("Formato", "TKL (Tenkeyless), 87 teclas", 2),
                ("Iluminación", "RGB, 18 modos", 3),
                ("Construcción", "Placa metálica y ABS reforzado", 4),
                ("Anti-ghosting", "N-key rollover en las 87 teclas", 5)
            ],
            "fotos": ["redragon-k552-kumara.jpg"]
        },
        {
            "id": 13,
            "categoria_slug": "mouses",
            "nombre": "Mouse Gamer Razer DeathAdder Essential White Edition",
            "marca": "Razer",
            "subcategoria": "Ergonómicos",
            "descripcion": "Mouse gamer alámbrico para diestros con diseño ergonómico, sensor óptico de 6,400 DPI reales, 5 botones programables y switches mecánicos Razer con vida útil de hasta 10 millones de clics. Agarres laterales de goma y solo 96 g de peso.",
            "precio": 599.0,
            "precio_original": 799.0,
            "conectividad": "Alámbrico",
            "etiqueta_conexion": "USB-A",
            "rgb": 0,
            "retiro_villahermosa": 1,
            "envio_gratis": 0,
            "publico": "gamer",
            "tipo_ilustracion": "mouse",
            "stock": 25,
            "stock_flash": 6,
            "popularidad": 87,
            "fecha_alta": "2026-01-28",
            "foto": "razer-deathadder-essential",
            "specs": [
                ("Sensor", "Óptico, 6,400 DPI reales", 1),
                ("Botones", "5 programables Hyperesponse", 2),
                ("Switches", "Mecánicos Razer, hasta 10M de clics", 3),
                ("Peso", "96 g", 4),
                ("Conexión", "USB-A con cable trenzado", 5)
            ],
            "fotos": ["razer-deathadder-essential.jpg"]
        },
        {
            "id": 14,
            "categoria_slug": "audifonos",
            "nombre": "Audífonos Gamer Razer BlackShark V2 X Multiplataforma",
            "marca": "Razer",
            "subcategoria": "Alámbricos",
            "descripcion": "Audífonos gamer con cable para esports: diafragmas Razer TriForce de 50 mm, micrófono cardioide HyperClear (flexible, no desmontable), almohadillas de espuma con memoria y solo 240 g. Su conexión de 3.5 mm funciona con PC, Mac, PlayStation, Xbox, Switch y celular.",
            "precio": 1199.0,
            "precio_original": 1499.0,
            "conectividad": "Alámbrico",
            "etiqueta_conexion": "Jack 3.5 mm",
            "rgb": 0,
            "retiro_villahermosa": 0,
            "envio_gratis": 1,
            "publico": "gamer",
            "tipo_ilustracion": "headset",
            "stock": 19,
            "stock_flash": 4,
            "popularidad": 92,
            "fecha_alta": "2026-02-10",
            "foto": "razer-blackshark-v2-x",
            "specs": [
                ("Diafragmas", "Razer TriForce de 50 mm", 1),
                ("Conexión", "Jack de 3.5 mm (incluye cable divisor para PC)", 2),
                ("Micrófono", "Cardioide Razer HyperClear flexible", 3),
                ("Peso", "240 g ultraligero", 4),
                ("Almohadillas", "Espuma viscoelástica transpirable", 5)
            ],
            "fotos": ["razer-blackshark-v2-x.jpg"]
        }
    ]

    for p in productos_seed:
        cat_id = cat_map[p["categoria_slug"]]
        cursor.execute("""
            INSERT INTO productos (
                id, categoria_id, nombre, marca, subcategoria, descripcion,
                precio, precio_original, conectividad, etiqueta_conexion,
                rgb, retiro_villahermosa, envio_gratis, publico, tipo_ilustracion,
                stock, stock_flash, popularidad, fecha_alta, foto, activo
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1);
        """, (
            p["id"], cat_id, p["nombre"], p["marca"], p["subcategoria"], p["descripcion"],
            p["precio"], p["precio_original"], p["conectividad"], p["etiqueta_conexion"],
            p["rgb"], p["retiro_villahermosa"], p["envio_gratis"], p["publico"], p["tipo_ilustracion"],
            p["stock"], p["stock_flash"], p["popularidad"], p["fecha_alta"], p["foto"]
        ))

        # 3. PRODUCTO SPECS
        for s in p["specs"]:
            cursor.execute("""
                INSERT INTO producto_specs (producto_id, etiqueta, valor, orden)
                VALUES (?, ?, ?, ?);
            """, (p["id"], s[0], s[1], s[2]))

        # 4. PRODUCTO FOTOS
        for idx, foto in enumerate(p["fotos"]):
            cursor.execute("""
                INSERT INTO producto_fotos (producto_id, archivo, orden)
                VALUES (?, ?, ?);
            """, (p["id"], foto, idx + 1))

    conn.commit()

    # 5. CLIENTES
    # No se siembran usuarios predeterminados. Las cuentas se crean desde /api/auth/register.

    # 8. CUPONES
    cupones_seed = [
        ("ESTUDIANTE10", "porcentaje", 10.0, 1, "2026-12-31"),
        ("NEXUS100", "monto", 100.0, 1, "2026-12-31"),
        ("VILLAHERMOSA", "monto", 149.0, 1, "2026-12-31")
    ]
    cursor.executemany("""
        INSERT INTO cupones (codigo, tipo, valor, activo, vence_en)
        VALUES (?, ?, ?, ?, ?);
    """, cupones_seed)
    conn.commit()

    # 9. PEDIDOS (Historial de compras con snapshots)
    pedidos_seed = [
        (
            "NX-84291", None, "Carlos Mendoza", "carlos.mendoza@alumno.ujat.mx", "9931234567",
            "domicilio", "Prolongación Paseo Tabasco #1402 Int 4B", "Tabasco 2000", "Villahermosa", "Tabasco", "86035",
            "Frente a Galerías Tabasco", None, "tarjeta", 6, 1,
            1608.0, 160.8, 0.0, 1447.2, "En camino vía FedEx", "7894201849", "2026-11-06 14:20:00"
        ),
        (
            "NX-71024", None, "Carlos Mendoza", "carlos.mendoza@alumno.ujat.mx", "9931234567",
            "retiro_villahermosa", "Plaza Atenas Local 12", "Tabasco 2000", "Villahermosa", "Tabasco", "86035",
            "Punto aliado Nexus Villahermosa", None, "contra_entrega", 1, None,
            1127.0, 0.0, 0.0, 1127.0, "Listo en Villahermosa", None, "2026-10-28 11:15:00"
        ),
        (
            "NX-59302", None, "Sofía Reyes", "sofia.reyes@gmail.com", "5541298451",
            "domicilio", "Av. Insurgentes Sur #1204", "Del Valle", "CDMX", "CDMX", "03100",
            "Dejar en caseta de vigilancia", None, "tarjeta", 3, 2,
            639.0, 100.0, 149.0, 688.0, "Pagado", "FEDEX-8831920", "2026-11-12 18:30:00"
        )
    ]
    cursor.executemany("""
        INSERT INTO pedidos (
            folio, usuario_id, nombre_contacto, correo_contacto, telefono_contacto,
            tipo_envio, calle, colonia, ciudad, estado_republica, cp, referencias, rfc,
            metodo_pago, meses_msi, cupon_id, subtotal, descuento, envio, total,
            estado, guia, creado_en
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, pedidos_seed)
    conn.commit()

    # 10. PEDIDO_ITEMS (Renglones de pedido con precios congelados)
    pedido_items_seed = [
        # Para NX-84291 (id 1)
        (1, 1, "Audífonos Gamer Inalámbricos Logitech G435 LIGHTSPEED + Bluetooth", 1, 639.0),
        (1, 4, "Mousepad Gamer XXL Razer Gigantus V2 940 x 410 mm", 1, 969.0),
        # Para NX-71024 (id 2)
        (2, 2, "Teclado Mecánico 65% Hot-Swap Royal Kludge RK68 Bluetooth", 1, 1127.0),
        # Para NX-59302 (id 3)
        (3, 1, "Audífonos Gamer Inalámbricos Logitech G435 LIGHTSPEED + Bluetooth", 1, 639.0)
    ]
    cursor.executemany("""
        INSERT INTO pedido_items (pedido_id, producto_id, nombre_producto, cantidad, precio_unitario)
        VALUES (?, ?, ?, ?, ?);
    """, pedido_items_seed)

    # 11. FAVORITOS (M:N con PK compuesta)
    # No se siembran favoritos porque no hay usuarios predeterminados.

    # 12. RESEÑAS
    # Las calificaciones y total de reseñas de productos se calculan dinámicamente con AVG y COUNT
    resenas_seed = [
        (1, None, "Diego Navarro (Villahermosa, Tabasco)", 5, "Excelente audífono. Los acabados son de primera y súper ligeros para estudiar y jugar. Pasé a recogerlo a Tabasco 2000 y el trato fue impecable.", "2026-11-09 10:00:00"),
        (1, None, "Sofía Reyes (CDMX)", 5, "Llegó en 2 días por FedEx hasta la alcaldía Cuauhtémoc. El empaque venía bien protegido con burbuja. Vale totalmente lo que cuesta.", "2026-11-07 14:15:00"),
        (1, None, "Mateo Juárez", 5, "La batería dura muchísimo y pesa casi nada. Muy cómodo con lentes.", "2026-11-02 09:20:00"),
        (2, None, "Carlos Mendoza (Villahermosa)", 5, "Excelente teclado para programar en la uni y jugar. El sonido de los switches es delicioso y no molesta.", "2026-10-30 18:00:00"),
        (2, None, "Roberto C.", 4, "Muy compacto y la batería aguanta bien. Solo recordar que no tiene tecla Ñ física, pero en Windows se configura fácil.", "2026-10-25 12:40:00"),
        (3, None, "Alejandro Téllez (Monterrey)", 5, "El mouse Razer Orochi V2 es una locura de ligero. Venía de un mouse pesado de oficina y la diferencia en puntería es brutal.", "2026-10-15 15:30:00"),
        (5, None, "Emilio Ramos (Guadalajara)", 5, "El sonido 7.1 en shooters competitivos como CS2 y Valorant te permite escuchar exactamente por dónde vienen los pasos.", "2026-09-20 11:00:00"),
        (7, None, "Luis Fernando (Puebla)", 5, "El mejor mouse ergonómico de la historia. Las pesitas intercambiables hacen que se adapte perfecto a tu mano.", "2026-10-05 16:20:00"),
        (10, None, "Mariana G.", 5, "La barra de luz Xiaomi es indispensable para los que estudiamos de noche. Sin reflejos en la pantalla y con control inalámbrico elegante.", "2026-10-18 20:10:00"),
        (12, None, "Kevin P.", 5, "El Redragon Kumara es indestructible. Switches con clic muy satisfactorio y excelente brillo RGB.", "2026-10-22 17:05:00")
    ]
    cursor.executemany("""
        INSERT INTO resenas (producto_id, usuario_id, autor, calificacion, comentario, creado_en)
        VALUES (?, ?, ?, ?, ?, ?);
    """, resenas_seed)

    # 13. TICKETS_SOPORTE
    tickets_seed = [
        ("Jorge López", "jorge.lopez@correo.com", "9932019482", "Consulta sobre recolección en Tabasco 2000", "¿Puedo enviar a otra persona a recoger mi paquete con una copia de mi INE?", 1, "2026-11-08 09:30:00"),
        ("Paola Torres", "paola.torres@unam.mx", "5512839201", "Duda sobre cupón ESTUDIANTE10", "Hola, ¿el 10% aplica también para pagos con tarjeta de débito a meses?", 0, "2026-11-13 14:10:00")
    ]
    cursor.executemany("""
        INSERT INTO tickets_soporte (nombre, correo, telefono, asunto, mensaje, atendido, creado_en)
        VALUES (?, ?, ?, ?, ?, ?, ?);
    """, tickets_seed)

    # Semilla de variantes también para bases de datos recién creadas.
    cursor.execute("UPDATE productos SET variantes = ? WHERE variantes IS NULL AND tipo_ilustracion = 'keyboard';", (teclado_variantes,))
    cursor.execute("UPDATE productos SET variantes = ? WHERE variantes IS NULL AND tipo_ilustracion = 'mouse';", (mouse_variantes,))

    conn.commit()
    conn.close()
    print("[OK] Base de datos SQLite inicializada exitosamente con 13 tablas y registros de prueba.")

if __name__ == '__main__':
    init_db(force_recreate=True)
