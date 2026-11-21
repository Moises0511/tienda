import os
import sqlite3

DB = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tienda.db')
conn = sqlite3.connect(DB)
cur = conn.execute(
    "UPDATE pedidos SET usuario_id = 8 WHERE usuario_id IS NULL AND correo_contacto = 'estudiante@alumno.ujat.mx'"
)
print('pedidos ligados:', cur.rowcount)
conn.commit()
conn.close()
