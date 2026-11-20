import argparse
import datetime

from werkzeug.security import generate_password_hash

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from database import get_db, init_db


def main():
    parser = argparse.ArgumentParser(description="Crea o promueve un usuario administrador de NEXUS GEAR MX.")
    parser.add_argument("correo", help="Correo del administrador")
    parser.add_argument("password", help="Contraseña del administrador")
    parser.add_argument("--nombre", default="Administrador Nexus", help="Nombre visible del administrador")
    parser.add_argument("--telefono", default="", help="Teléfono de contacto")
    args = parser.parse_args()

    correo = args.correo.strip().lower()
    if not correo or not args.password:
        raise SystemExit("Correo y contraseña son obligatorios.")

    init_db(force_recreate=False)

    conn = get_db()
    cursor = conn.cursor()
    ahora = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    password_hash = generate_password_hash(args.password)

    cursor.execute("SELECT id FROM usuarios WHERE correo = ?;", (correo,))
    existing = cursor.fetchone()

    if existing:
        cursor.execute(
            "UPDATE usuarios SET nombre = ?, password_hash = ?, telefono = ?, rol = 'admin' WHERE id = ?;",
            (args.nombre, password_hash, args.telefono, existing["id"])
        )
        usuario_id = existing["id"]
        accion = "promovido"
    else:
        cursor.execute(
            "INSERT INTO usuarios (nombre, correo, password_hash, telefono, rol, creado_en) VALUES (?, ?, ?, ?, 'admin', ?);",
            (args.nombre, correo, password_hash, args.telefono, ahora)
        )
        usuario_id = cursor.lastrowid
        accion = "creado"
        cursor.execute(
            "INSERT OR IGNORE INTO preferencias (usuario_id, alertas_whatsapp, boletin) VALUES (?, 1, 1);",
            (usuario_id,)
        )

    conn.commit()
    conn.close()
    print(f"[OK] Administrador {accion}: {correo} (id {usuario_id})")


if __name__ == "__main__":
    main()
