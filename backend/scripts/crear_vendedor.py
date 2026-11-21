import datetime

from werkzeug.security import generate_password_hash

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from database import get_db, init_db


def main():
    init_db(force_recreate=False)
    conn = get_db()
    cursor = conn.cursor()
    ahora = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    correo = "moises@nexus.mx"
    password_hash = generate_password_hash("moises123")

    cursor.execute("SELECT id FROM usuarios WHERE correo = ?;", (correo,))
    existing = cursor.fetchone()
    if existing:
        usuario_id = existing["id"]
        cursor.execute(
            "UPDATE usuarios SET nombre = ?, password_hash = ?, telefono = ?, rol = 'vendedor' WHERE id = ?;",
            ("Moises Vendedor", password_hash, "7770001111", usuario_id)
        )
    else:
        cursor.execute(
            "INSERT INTO usuarios (nombre, correo, password_hash, telefono, rol, creado_en) VALUES (?, ?, ?, ?, 'vendedor', ?);",
            ("Moises Vendedor", correo, password_hash, "7770001111", ahora)
        )
        usuario_id = cursor.lastrowid
        cursor.execute(
            "INSERT OR IGNORE INTO preferencias (usuario_id, alertas_whatsapp, boletin) VALUES (?, 1, 1);",
            (usuario_id,)
        )

    cursor.execute("UPDATE productos SET vendedor_id = ?;", (usuario_id,))
    productos_asignados = cursor.rowcount
    conn.commit()

    cursor.execute("SELECT COUNT(*) AS total FROM productos WHERE vendedor_id = ?;", (usuario_id,))
    total_vendedor = cursor.fetchone()["total"]
    conn.close()

    print(f"[OK] Vendedor {'actualizado' if existing else 'creado'}: {correo} (id {usuario_id})")
    print(f"[OK] Productos asignados a moises: {productos_asignados}; total del vendedor: {total_vendedor}")


if __name__ == "__main__":
    main()
