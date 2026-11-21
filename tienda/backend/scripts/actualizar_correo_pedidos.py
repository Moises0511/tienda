import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import database

conn = database.get_db()
cur = conn.cursor()
cur.execute(
    "UPDATE pedidos SET correo_contacto='252v42894@alumno.ujat.mx', "
    "nombre_contacto='Moisés Iván Reyes Porta' WHERE usuario_id=8"
)
conn.commit()
print('pedidos actualizados:', cur.rowcount)
for r in conn.execute('SELECT folio, correo_contacto, estado FROM pedidos WHERE usuario_id=8').fetchall():
    print(dict(r))
conn.close()
