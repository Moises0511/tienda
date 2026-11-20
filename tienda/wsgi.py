"""
Archivo WSGI para PythonAnywhere.
En el panel de PythonAnywhere -> Web -> WSGI configuration file,
apunta a este archivo (ej: /home/TU_USUARIO/tienda/wsgi.py)
"""
import os
import sys

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(BASE_DIR, 'backend'))

# Inicializar la base de datos SQLite si no existe
import database
database.init_db(force_recreate=False)

# Exponer la aplicación Flask
from server import app
