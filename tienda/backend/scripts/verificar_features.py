import sys, os, tempfile
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import database
_tmp = tempfile.NamedTemporaryFile(suffix='.db', delete=False)
_tmp.close()
database.DB_PATH = _tmp.name
database.init_db(force_recreate=True)
import server

c = server.app.test_client()

# 1. Producto con variantes
prods = c.get('/api/productos').get_json()['productos']
teclado = next(p for p in prods if p.get('variants'))
print('variantes en API:', teclado['name'][:40], '->', list(teclado['variants'].keys()))

# 2. Pedido con variante Blue (+150) y pago SPEI
res = c.post('/api/pedidos', json={
    'nombre_contacto': 'Test', 'correo_contacto': 't@t.com', 'telefono_contacto': '1',
    'tipo_envio': 'retiro_villahermosa', 'metodo_pago': 'spei',
    'items': [{'producto_id': teclado['id'], 'cantidad': 1,
               'variante': {'Tipo de Switch': 'Blue (Clicky)', 'Color del Chasis': 'Cyber Purple'}}]
})
d = res.get_json()
print('pedido ok:', d.get('ok'), '| subtotal:', d.get('subtotal'), '| metodo:', d.get('metodo_pago', '?'))

# 3. Newsletter
res = c.post('/api/newsletter/suscribir', json={'correo': 'fan@nexus.mx'})
print('newsletter:', res.get_json())
res = c.post('/api/newsletter/suscribir', json={'correo': 'fan@nexus.mx'})
print('newsletter duplicado:', res.get_json()['ok'])
res = c.post('/api/newsletter/suscribir', json={'correo': 'no-es-correo'})
print('newsletter invalido:', res.status_code)

# 4. Variante invalida no suma precio
res = c.post('/api/pedidos', json={
    'nombre_contacto': 'Test', 'correo_contacto': 't@t.com', 'telefono_contacto': '1',
    'tipo_envio': 'retiro_villahermosa', 'metodo_pago': 'spei',
    'items': [{'producto_id': teclado['id'], 'cantidad': 1, 'variante': {'Tipo de Switch': 'OpcionFalsa'}}]
})
print('variante invalida subtotal (debe ser precio base):', res.get_json().get('subtotal'), 'vs precio', teclado['price'])
