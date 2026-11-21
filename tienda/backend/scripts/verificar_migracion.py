import sqlite3
import database

database.init_db()
conn = sqlite3.connect(database.DB_PATH)
c = conn.cursor()
print('cols productos:', [r[1] for r in c.execute('PRAGMA table_info(productos)') if r[1] in ('variantes', 'vendedor_id')])
print('cols items:', [r[1] for r in c.execute('PRAGMA table_info(pedido_items)')])
print('spei en check:', 'spei' in c.execute("SELECT sql FROM sqlite_master WHERE name='pedidos'").fetchone()[0])
print('productos con variantes:', c.execute('SELECT COUNT(*) FROM productos WHERE variantes IS NOT NULL').fetchone()[0])
print('suscriptores existe:', c.execute("SELECT name FROM sqlite_master WHERE name='suscriptores'").fetchone())
print('pedidos intactos:', c.execute('SELECT COUNT(*) FROM pedidos').fetchone()[0])
conn.close()
