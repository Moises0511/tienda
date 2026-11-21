"""
Pruebas de flujo: devolución de producto y edición de productos por vendedor.
Usa una base de datos SQLite temporal; no toca tienda.db.
"""

import os
import sys
import sqlite3
import tempfile
import unittest

BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BACKEND_DIR)

import database
from werkzeug.security import generate_password_hash

_tmp = tempfile.NamedTemporaryFile(suffix='.db', delete=False)
_tmp.close()
database.DB_PATH = _tmp.name

import server  # noqa: E402  (importa después de fijar DB_PATH)


class FlujoTiendaTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        database.init_db(force_recreate=True)
        conn = database.get_db()
        cursor = conn.cursor()
        ahora = '2026-01-01 00:00:00'
        cursor.execute(
            "INSERT INTO usuarios (nombre, correo, password_hash, telefono, rol, creado_en) VALUES (?, ?, ?, ?, 'admin', ?)",
            ('Admin Test', 'admin@test.com', generate_password_hash('admin123'), '000', ahora)
        )
        conn.commit()
        conn.close()

    def setUp(self):
        self.cliente = server.app.test_client()
        self.admin = server.app.test_client()
        self.vendedor = server.app.test_client()
        self.otro_vendedor = server.app.test_client()

    def _register(self, client, nombre, correo, rol='cliente'):
        res = client.post('/api/auth/register', json={
            'nombre': nombre, 'correo': correo, 'password': 'pass123',
            'telefono': '9930000000', 'rol': rol
        })
        self.assertEqual(res.status_code, 200, res.get_json())
        return res.get_json()['cliente']

    def _login(self, client, correo, password='pass123'):
        res = client.post('/api/auth/login', json={'correo': correo, 'password': password})
        self.assertEqual(res.status_code, 200, res.get_json())

    def _categoria_id(self):
        res = self.cliente.get('/api/categorias')
        return res.get_json()['categorias'][0]['id']

    def _crear_pedido_entregado(self):
        """Cliente logueado crea pedido y admin lo marca Entregado."""
        self._login(self.cliente, 'comprador@test.com')
        prods = self.cliente.get('/api/productos').get_json()['productos']
        prod = next(p for p in prods if p['stock'] > 0)
        stock_antes = prod['stock']

        res = self.cliente.post('/api/pedidos', json={
            'nombre_contacto': 'Comprador Test',
            'correo_contacto': 'comprador@test.com',
            'telefono_contacto': '9930000001',
            'tipo_envio': 'retiro_villahermosa',
            'items': [{'producto_id': prod['id'], 'cantidad': 1}]
        })
        data = res.get_json()
        self.assertTrue(data['ok'], data)
        folio = data['folio']

        detalle = self.cliente.get(f'/api/pedidos/{folio}').get_json()['pedido']
        pedido_id = detalle['id']

        self._login(self.admin, 'admin@test.com', 'admin123')
        res = self.admin.put(f'/api/panel/admin/pedidos/{pedido_id}/estado',
                             json={'estado': 'Entregado'})
        self.assertTrue(res.get_json()['ok'], res.get_json())
        return pedido_id, prod['id'], stock_antes

    def test_devolucion_flujo_completo(self):
        self._register(self.cliente, 'Comprador Test', 'comprador@test.com')
        pedido_id, prod_id, stock_antes = self._crear_pedido_entregado()

        # Sin sesión no se puede solicitar devolución
        anon = server.app.test_client()
        res = anon.post(f'/api/pedidos/{pedido_id}/devolucion')
        self.assertEqual(res.status_code, 401)

        # El dueño solicita la devolución
        res = self.cliente.post(f'/api/pedidos/{pedido_id}/devolucion')
        data = res.get_json()
        self.assertTrue(data['ok'], data)
        self.assertEqual(data['estado'], 'Devolución solicitada')

        # Solicitud duplicada es idempotente
        res = self.cliente.post(f'/api/pedidos/{pedido_id}/devolucion')
        self.assertTrue(res.get_json()['ok'])

        # Otro cliente no puede tocar el pedido
        self._register(self.otro_vendedor, 'Otro', 'otro@test.com')
        self._login(self.otro_vendedor, 'otro@test.com')
        res = self.otro_vendedor.post(f'/api/pedidos/{pedido_id}/devolucion')
        self.assertEqual(res.status_code, 403)

        # Admin marca Devuelto: regresa stock una sola vez
        self._login(self.admin, 'admin@test.com', 'admin123')
        res = self.admin.put(f'/api/panel/admin/pedidos/{pedido_id}/estado',
                             json={'estado': 'Devuelto'})
        self.assertTrue(res.get_json()['ok'])
        res = self.admin.put(f'/api/panel/admin/pedidos/{pedido_id}/estado',
                             json={'estado': 'Devuelto'})
        self.assertTrue(res.get_json()['ok'])

        conn = database.get_db()
        stock = conn.execute('SELECT stock FROM productos WHERE id = ?', (prod_id,)).fetchone()['stock']
        conn.close()
        self.assertEqual(stock, stock_antes)

    def test_vendedor_edita_solo_sus_productos(self):
        self._register(self.vendedor, 'Vendedor A', 'vendedorA@test.com', rol='vendedor')
        self._register(self.otro_vendedor, 'Vendedor B', 'vendedorB@test.com', rol='vendedor')
        cat_id = self._categoria_id()

        res = self.vendedor.post('/api/panel/vendedor/productos', json={
            'categoria_id': cat_id, 'nombre': 'Producto A', 'marca': 'MarcaA',
            'precio': 100, 'stock': 5
        })
        self.assertEqual(res.status_code, 201, res.get_json())
        prod_a = res.get_json()['id']

        res = self.otro_vendedor.post('/api/panel/vendedor/productos', json={
            'categoria_id': cat_id, 'nombre': 'Producto B', 'marca': 'MarcaB',
            'precio': 200, 'stock': 3
        })
        prod_b = res.get_json()['id']

        # Vendedor A edita su producto
        res = self.vendedor.put(f'/api/panel/vendedor/productos/{prod_a}',
                                json={'nombre': 'Producto A Editado', 'precio': 150})
        self.assertTrue(res.get_json()['ok'], res.get_json())

        # Vendedor A no puede editar producto de B
        res = self.vendedor.put(f'/api/panel/vendedor/productos/{prod_b}',
                                json={'nombre': 'Hackeado'})
        self.assertEqual(res.status_code, 403)

        # El listado del vendedor A solo contiene su producto
        res = self.vendedor.get('/api/panel/vendedor/productos')
        ids = [p['id'] for p in res.get_json()['productos']]
        self.assertIn(prod_a, ids)
        self.assertNotIn(prod_b, ids)


    def test_cupon_estudiante_solo_ujat(self):
        # Estudiante UJAT puede validar el cupón
        self._register(self.cliente, 'Estudiante UJAT', 'alumno123@alumno.ujat.mx')
        self._login(self.cliente, 'alumno123@alumno.ujat.mx')
        res = self.cliente.post('/api/cupones/validar', json={'codigo': 'ESTUDIANTE10', 'subtotal': 500})
        self.assertTrue(res.get_json()['ok'], res.get_json())

        # Usuario normal no puede usarlo
        self._register(self.otro_vendedor, 'Normal', 'normal@test.com')
        self._login(self.otro_vendedor, 'normal@test.com')
        res = self.otro_vendedor.post('/api/cupones/validar', json={'codigo': 'ESTUDIANTE10', 'subtotal': 500})
        self.assertEqual(res.status_code, 403)

        # Invitado tampoco
        anon = server.app.test_client()
        res = anon.post('/api/cupones/validar', json={'codigo': 'ESTUDIANTE10', 'subtotal': 500})
        self.assertEqual(res.status_code, 403)

        # El pedido del estudiante aplica el descuento
        self._login(self.cliente, 'alumno123@alumno.ujat.mx')
        prods = self.cliente.get('/api/productos').get_json()['productos']
        prod = next(p for p in prods if p['stock'] > 0)
        res = self.cliente.post('/api/pedidos', json={
            'nombre_contacto': 'Estudiante UJAT',
            'correo_contacto': 'alumno123@alumno.ujat.mx',
            'telefono_contacto': '9930000002',
            'tipo_envio': 'retiro_villahermosa',
            'codigo_cupon': 'ESTUDIANTE10',
            'items': [{'producto_id': prod['id'], 'cantidad': 1}]
        })
        data = res.get_json()
        self.assertTrue(data['ok'], data)
        self.assertGreater(data['descuento'], 0)



    def test_eliminar_cuenta(self):
        # Sin sesion no puede eliminar
        anon = server.app.test_client()
        res = anon.delete('/api/cuenta')
        self.assertEqual(res.status_code, 401)

        # Registra y elimina su cuenta
        self._register(self.cliente, 'Borrable', 'borrable@test.com')
        self._login(self.cliente, 'borrable@test.com')
        res = self.cliente.delete('/api/cuenta')
        data = res.get_json()
        self.assertTrue(data['ok'], data)

        # La sesion quedo invalida
        res = self.cliente.get('/api/auth/me')
        self.assertFalse(res.get_json().get('autenticado', True))

        # El usuario ya no existe en la BD
        conn = database.get_db()
        row = conn.execute("SELECT id FROM usuarios WHERE correo = 'borrable@test.com'").fetchone()
        conn.close()
        self.assertIsNone(row)


    def test_newsletter_y_variantes(self):
        # Newsletter: registra, es idempotente y valida correo
        res = self.cliente.post('/api/newsletter/suscribir', json={'correo': 'fan@nexus.mx'})
        self.assertTrue(res.get_json()['ok'])
        res = self.cliente.post('/api/newsletter/suscribir', json={'correo': 'fan@nexus.mx'})
        self.assertTrue(res.get_json()['ok'])
        res = self.cliente.post('/api/newsletter/suscribir', json={'correo': 'invalido'})
        self.assertEqual(res.status_code, 400)

        conn = database.get_db()
        total = conn.execute("SELECT COUNT(*) AS t FROM suscriptores WHERE correo='fan@nexus.mx'").fetchone()['t']
        conn.close()
        self.assertEqual(total, 1)

        # Producto con variantes (teclado sembrado)
        prods = self.cliente.get('/api/productos').get_json()['productos']
        prod = next(p for p in prods if p.get('variants'))
        grupo = list(prod['variants'].keys())[0]
        opciones = prod['variants'][grupo]
        # Elegir la opción con mayor sobreprecio
        opcion_costosa = max(opciones.items(), key=lambda kv: kv[1])
        extra = float(opcion_costosa[1] or 0)

        res = self.cliente.post('/api/pedidos', json={
            'nombre_contacto': 'Cliente Var',
            'correo_contacto': 'variante@test.com',
            'telefono_contacto': '9930000003',
            'tipo_envio': 'retiro_villahermosa',
            'metodo_pago': 'spei',
            'items': [{'producto_id': prod['id'], 'cantidad': 1,
                       'variante': {grupo: opcion_costosa[0]}}]
        })
        data = res.get_json()
        self.assertTrue(data['ok'], data)
        self.assertAlmostEqual(data['subtotal'], prod['price'] + extra, places=2)

if __name__ == '__main__':
    unittest.main(verbosity=2)
