import os
import random
import sqlite3
import string

DB = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'tienda.db')
conn = sqlite3.connect(DB)
conn.row_factory = sqlite3.Row

usuarios = conn.execute("SELECT id, nombre, correo, rol FROM usuarios WHERE rol != 'admin'").fetchall()
if not usuarios:
    usuarios = conn.execute('SELECT id, nombre, correo, rol FROM usuarios').fetchall()

elegido = random.choice(usuarios)
existentes = {r['correo'] for r in conn.execute('SELECT correo FROM usuarios')}

while True:
    anio = random.randint(23, 25)
    periodo = random.choice([1, 2])
    letra = random.choice(string.ascii_lowercase)
    nums = ''.join(str(random.randint(0, 9)) for _ in range(5))
    correo = f'{anio}{periodo}{letra}{nums}@alumno.ujat.mx'
    if correo not in existentes:
        break

conn.execute('UPDATE usuarios SET correo = ? WHERE id = ?', (correo, elegido['id']))
conn.commit()
print('Usuario elegido:', dict(elegido))
print('Nuevo correo   :', correo)
conn.close()
