import urllib.request
import urllib.error
import json

def test(url, method='GET', data=None):
    req = urllib.request.Request(url, method=method)
    if data:
        req.add_header('Content-Type', 'application/json')
        body = json.dumps(data).encode('utf-8')
    else:
        body = None
    try:
        with urllib.request.urlopen(req, data=body, timeout=5) as res:
            return res.status, json.loads(res.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        raw = e.read().decode('utf-8')
        try:
            return e.code, json.loads(raw)
        except Exception:
            return e.code, {"ok": False, "error": raw}

print("--- INICIANDO PRUEBAS DE LA API REST Y BASE DE DATOS SQLITE ---")

# 1. Categorías
s1, r1 = test('http://localhost:5000/api/categorias')
print(f"1. GET /api/categorias -> Status {s1}, Total: {len(r1['categorias'])}")

# 2. Productos
s2, r2 = test('http://localhost:5000/api/productos')
print(f"2. GET /api/productos -> Status {s2}, Total: {r2['total']}, Rating del primero: {r2['productos'][0]['rating']} ({r2['productos'][0]['reviewsCount']} reseñas)")

# 3. Detalle de Producto con Specs y Fotos
s3, r3 = test('http://localhost:5000/api/productos/1')
print(f"3. GET /api/productos/1 -> Status {s3}, Nombre: {r3['producto']['nombre']}, Specs: {len(r3['producto']['specs'])}, Fotos: {len(r3['producto']['fotos'])}")

# 4. Cupones
s4, r4 = test('http://localhost:5000/api/cupones/validar', 'POST', {'codigo': 'ESTUDIANTE10', 'subtotal': 1500})
print(f"4. POST /api/cupones/validar -> Status {s4}, Código: {r4['cupon']['codigo']}, Descuento calculado: ${r4['cupon']['descuento']} MXN")

# 5. Tablas de la BD (protegidas: solo admin)
s5, r5 = test('http://localhost:5000/api/bd/tablas')
print(f"5. GET /api/bd/tablas -> Status {s5}, ok={r5.get('ok')}, error={r5.get('error')}")

# 6. Crear Pedido (Transacción atómica con pedido_items)
s6, r6 = test('http://localhost:5000/api/pedidos', 'POST', {
    'nombre_contacto': 'Estudiante UJAT',
    'correo_contacto': 'estudiante@alumno.ujat.mx',
    'telefono_contacto': '9931234567',
    'tipo_envio': 'retiro_villahermosa',
    'calle': 'Tabasco 2000',
    'metodo_pago': 'contra_entrega',
    'codigo_cupon': 'ESTUDIANTE10',
    'items': [{'producto_id': 2, 'cantidad': 1}]
})
print(f"6. POST /api/pedidos -> Status {s6}, Folio: {r6['folio']}, Total: ${r6['total']} MXN, Estado: {r6['estado']}")

# 7. Consultar Pedido por Folio
s7, r7 = test(f"http://localhost:5000/api/pedidos/{r6['folio']}")
print(f"7. GET /api/pedidos/{r6['folio']} -> Status {s7}, Cliente: {r7['pedido']['nombre_contacto']}, Partidas guardadas: {len(r7['pedido']['items'])}")

# 8. Agregar Reseña (Cálculo dinámico en SQLite)
s8, r8 = test('http://localhost:5000/api/productos/1/resenas', 'POST', {
    'autor': 'Moisés Iván',
    'calificacion': 5,
    'comentario': 'Excelente calidad de audio para clases y gaming. Entrega súper rápida en Villahermosa.'
})
print(f"8. POST /api/productos/1/resenas -> Status {s8}, Nuevo rating: {r8['rating']}, Total reseñas: {r8['reviewsCount']}")

# 9. Crear Ticket de Soporte
s9, r9 = test('http://localhost:5000/api/soporte/tickets', 'POST', {
    'nombre': 'Moisés Iván',
    'correo': 'moises@correo.com',
    'telefono': '9931234567',
    'asunto': 'Pregunta sobre entrega en Tabasco 2000',
    'mensaje': '¿Se puede pagar con transferencia SPEI al momento de recoger?'
})
print(f"9. POST /api/soporte/tickets -> Status {s9}, Ticket: {r9['ticket_id']}")

print("--- TODAS LAS PRUEBAS COMPLETADAS SATISFACTORIAMENTE ---")
