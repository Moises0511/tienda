import sqlite3
import database

conn = sqlite3.connect(database.DB_PATH)
c = conn.cursor()
sql = c.execute("SELECT sql FROM sqlite_master WHERE name='pedidos'").fetchone()[0]
print(sql[:600])
print('---')
print(c.execute('SELECT DISTINCT tipo_ilustracion FROM productos').fetchall())
print(c.execute("SELECT id, tipo_ilustracion, variantes FROM productos WHERE tipo_ilustracion IN ('keyboard','mouse')").fetchall())
conn.close()
