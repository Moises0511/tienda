-- ============================================================================
-- NEXUS GEAR MX - ESQUEMA DE BASE DE DATOS RELACIONAL (SQLite 3)
-- Proyecto Académico de Comercio Electrónico
-- Cumple con 3FN (Tercera Forma Normal) e Integridad Referencial
-- ============================================================================

PRAGMA foreign_keys = ON;

-- ----------------------------------------------------------------------------
-- 1. TABLA: categorias
-- Catálogo de categorías para navegación y filtros
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categorias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE
);

-- ----------------------------------------------------------------------------
-- 2. TABLA: productos
-- Periféricos y accesorios con sus atributos comerciales y de inventario
-- Nota: Calificaciones y reseñas se calculan dinámicamente con AVG y COUNT sobre resenas
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS productos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    categoria_id INTEGER NOT NULL,
    nombre TEXT NOT NULL,
    marca TEXT NOT NULL,
    subcategoria TEXT,
    descripcion TEXT,
    precio REAL NOT NULL CHECK (precio >= 0),
    precio_original REAL,
    vendedor_id INTEGER,
    conectividad TEXT CHECK (conectividad IN ('Inalámbrico', 'Alámbrico', 'Sin conexión')),
    etiqueta_conexion TEXT,
    rgb INTEGER DEFAULT 0 CHECK (rgb IN (0, 1)),
    retiro_villahermosa INTEGER DEFAULT 1 CHECK (retiro_villahermosa IN (0, 1)),
    envio_gratis INTEGER DEFAULT 0 CHECK (envio_gratis IN (0, 1)),
    publico TEXT CHECK (publico IN ('gamer', 'estudiante', 'ambos')),
    tipo_ilustracion TEXT,
    variantes TEXT,
    stock INTEGER NOT NULL CHECK (stock >= 0),
    stock_flash INTEGER DEFAULT 0,
    popularidad INTEGER DEFAULT 50,
    fecha_alta TEXT NOT NULL,
    foto TEXT,
    activo INTEGER DEFAULT 1 CHECK (activo IN (0, 1)),
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (vendedor_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- ----------------------------------------------------------------------------
-- 3. TABLA: producto_specs
-- Ficha técnica detallada de cada producto (1 a muchos)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS producto_specs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    producto_id INTEGER NOT NULL,
    etiqueta TEXT NOT NULL,
    valor TEXT NOT NULL,
    orden INTEGER DEFAULT 0,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- 4. TABLA: producto_fotos
-- Galería de imágenes adicionales por producto (1 a muchos)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS producto_fotos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    producto_id INTEGER NOT NULL,
    archivo TEXT NOT NULL,
    orden INTEGER DEFAULT 0,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- 5. TABLA: usuarios
-- Cuentas de usuarios (usuarios registrados y administradores)
-- Contraseñas almacenadas en hash criptográfico seguro (PBKDF2 / Argon2 / SHA-256 con sal)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    correo TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    telefono TEXT,
    rol TEXT DEFAULT 'cliente' CHECK (rol IN ('cliente', 'admin', 'vendedor')),
    creado_en TEXT NOT NULL
);

-- ----------------------------------------------------------------------------
-- 6. TABLA: direcciones
-- Libreta de direcciones de envío del cliente (1 a muchos)
-- CP es TEXT para preservar ceros a la izquierda (ej. 06700 CDMX)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS direcciones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    calle TEXT NOT NULL,
    colonia TEXT,
    ciudad TEXT NOT NULL,
    estado TEXT NOT NULL,
    cp TEXT NOT NULL,
    referencias TEXT,
    principal INTEGER DEFAULT 0 CHECK (principal IN (0, 1)),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- 7. TABLA: preferencias
-- Opciones de notificación y alertas por cliente (relación 1 a 1)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS preferencias (
    usuario_id INTEGER PRIMARY KEY,
    alertas_whatsapp INTEGER DEFAULT 0 CHECK (alertas_whatsapp IN (0, 1)),
    boletin INTEGER DEFAULT 0 CHECK (boletin IN (0, 1)),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- 8. TABLA: cupones
-- Códigos promocionales (descuentos porcentuales o monto fijo en MXN)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cupones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo TEXT NOT NULL UNIQUE,
    tipo TEXT NOT NULL CHECK (tipo IN ('porcentaje', 'monto')),
    valor REAL NOT NULL CHECK (valor > 0),
    activo INTEGER DEFAULT 1 CHECK (activo IN (0, 1)),
    vence_en TEXT
);

-- ----------------------------------------------------------------------------
-- 9. TABLA: pedidos
-- Órdenes de compra generadas. Permite compra como invitado (usuario_id NULL)
-- Copia intencional de la dirección y contacto para congelar los datos históricos
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pedidos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    folio TEXT NOT NULL UNIQUE,
    usuario_id INTEGER,
    nombre_contacto TEXT NOT NULL,
    correo_contacto TEXT NOT NULL,
    telefono_contacto TEXT NOT NULL,
    tipo_envio TEXT NOT NULL CHECK (tipo_envio IN ('domicilio', 'retiro_villahermosa')),
    calle TEXT,
    colonia TEXT,
    ciudad TEXT,
    estado_republica TEXT,
    cp TEXT,
    referencias TEXT,
    rfc TEXT,
    metodo_pago TEXT NOT NULL CHECK (metodo_pago IN ('tarjeta', 'oxxo', 'spei', 'contra_entrega')),
    meses_msi INTEGER DEFAULT 1 CHECK (meses_msi IN (1, 3, 6)),
    cupon_id INTEGER,
    subtotal REAL NOT NULL CHECK (subtotal >= 0),
    descuento REAL DEFAULT 0 CHECK (descuento >= 0),
    envio REAL DEFAULT 0 CHECK (envio >= 0),
    total REAL NOT NULL CHECK (total >= 0),
    estado TEXT NOT NULL DEFAULT 'Pagado',
    stock_regresado INTEGER DEFAULT 0 CHECK (stock_regresado IN (0, 1)),
    guia TEXT,
    creado_en TEXT NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    FOREIGN KEY (cupon_id) REFERENCES cupones(id) ON DELETE SET NULL
);

-- ----------------------------------------------------------------------------
-- 10. TABLA: pedido_items
-- Renglones o partidas del pedido (relación M:N entre pedidos y productos)
-- Almacena precio_unitario histórico y nombre del producto al momento de compra
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pedido_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pedido_id INTEGER NOT NULL,
    producto_id INTEGER,
    nombre_producto TEXT NOT NULL,
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    precio_unitario REAL NOT NULL CHECK (precio_unitario >= 0),
    variante TEXT,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE SET NULL
);

-- ----------------------------------------------------------------------------
-- 11. TABLA: favoritos
-- Lista de deseos de usuarios registrados (relación M:N con llave primaria compuesta)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS favoritos (
    usuario_id INTEGER NOT NULL,
    producto_id INTEGER NOT NULL,
    PRIMARY KEY (usuario_id, producto_id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- 12. TABLA: resenas
-- Calificaciones y comentarios de productos (1 a 5 estrellas)
-- usuario_id puede ser NULL para reseñas iniciales o compras de invitado
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS resenas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    producto_id INTEGER NOT NULL,
    usuario_id INTEGER,
    autor TEXT NOT NULL,
    calificacion INTEGER NOT NULL CHECK (calificacion BETWEEN 1 AND 5),
    comentario TEXT NOT NULL,
    creado_en TEXT NOT NULL,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- ----------------------------------------------------------------------------
-- 13. TABLA: tickets_soporte
-- Mensajes y solicitudes del formulario de ayuda y atención al cliente
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tickets_soporte (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    correo TEXT NOT NULL,
    telefono TEXT,
    asunto TEXT NOT NULL,
    mensaje TEXT NOT NULL,
    atendido INTEGER DEFAULT 0 CHECK (atendido IN (0, 1)),
    creado_en TEXT NOT NULL
);

-- ----------------------------------------------------------------------------
-- ÍNDICES PARA MEJORA DE RENDIMIENTO EN BÚSQUEDAS Y JOINS
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_productos_categoria ON productos(categoria_id);
CREATE INDEX IF NOT EXISTS idx_productos_activo ON productos(activo);
CREATE INDEX IF NOT EXISTS idx_producto_specs_prod ON producto_specs(producto_id);
CREATE INDEX IF NOT EXISTS idx_producto_fotos_prod ON producto_fotos(producto_id);
CREATE INDEX IF NOT EXISTS idx_direcciones_usuario ON direcciones(usuario_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_usuario ON pedidos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_folio ON pedidos(folio);
CREATE INDEX IF NOT EXISTS idx_pedido_items_pedido ON pedido_items(pedido_id);
CREATE INDEX IF NOT EXISTS idx_resenas_producto ON resenas(producto_id);
CREATE INDEX IF NOT EXISTS idx_favoritos_prod ON favoritos(producto_id);

-- ----------------------------------------------------------------------------
-- 15. TABLA: suscriptores
-- Correos registrados en el newsletter del sitio (promociones y ofertas)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS suscriptores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    correo TEXT NOT NULL UNIQUE,
    creado_en TEXT NOT NULL
);
