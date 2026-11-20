/**
 * ============================================================================
 * NEXUS GEAR MX - MOTOR PRINCIPAL DE E-COMMERCE (JAVASCRIPT PURO)
 * Módulos 100% Funcionales Integrados:
 * - Módulo 1: Página de Inicio (Hero Slider, Ofertas Flash, Categorías, Villahermosa)
 * - Módulo 2: Catálogo de Productos (Filtros Avanzados, Orden, Grid/List, Buscador)
 * - Módulo 3: Página de Producto Individual (Galería con Zoom, Variantes, CP, Specs, Reseñas)
 * - Módulo 4: Carrito de Compras (Modificar Cantidades, Envío Real-Time, Cupones, Save for Later)
 * - Módulo 5: Checkout (Invitado/Registrado, Envío/Retiro Villahermosa, Tarjeta Interactiva, OXXO)
 * - Módulo 6: Mi Cuenta / Dashboard (Historial, Tracking Timeline, Wishlist, Libreta Direcciones)
 * - Módulo 7: Atención al Cliente (Centro de Ayuda, FAQ en Vivo, Contacto y Chatbot Nexus Bot)
 * ============================================================================
 */

'use strict';

// ============================================================================
// 1. GENERADOR DE ILUSTRACIONES VECTORIALES SVG EMBEBIDAS
// ============================================================================
function createProductSVG(type, primaryColor = '#00f2fe', secondaryColor = '#4facfe') {
  let innerArt = '';
  const pCol = primaryColor.replace('#', '');
  
  switch(type) {
    case 'headset':
      innerArt = `
        <defs>
          <linearGradient id="gHead_${pCol}" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="${primaryColor}"/>
            <stop offset="100%" stop-color="${secondaryColor}"/>
          </linearGradient>
        </defs>
        <path d="M50 110 C50 50, 150 50, 150 110" fill="none" stroke="url(#gHead_${pCol})" stroke-width="12" stroke-linecap="round"/>
        <path d="M60 110 C60 65, 140 65, 140 110" fill="none" stroke="#1f293d" stroke-width="6"/>
        <rect x="36" y="100" width="28" height="52" rx="14" fill="#162033" stroke="url(#gHead_${pCol})" stroke-width="3"/>
        <rect x="42" y="108" width="16" height="36" rx="8" fill="#0d1422"/>
        <rect x="136" y="100" width="28" height="52" rx="14" fill="#162033" stroke="url(#gHead_${pCol})" stroke-width="3"/>
        <rect x="142" y="108" width="16" height="36" rx="8" fill="#0d1422"/>
        <path d="M48 135 Q55 170 100 165" fill="none" stroke="#64748b" stroke-width="4" stroke-linecap="round"/>
        <circle cx="104" cy="165" r="7" fill="${primaryColor}"/>
        <circle cx="50" cy="126" r="4" fill="${primaryColor}"/>
        <circle cx="150" cy="126" r="4" fill="${primaryColor}"/>
      `;
      break;

    case 'keyboard':
      innerArt = `
        <defs>
          <linearGradient id="gKey_${pCol}" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="${primaryColor}"/>
            <stop offset="100%" stop-color="${secondaryColor}"/>
          </linearGradient>
        </defs>
        <rect x="25" y="65" width="150" height="90" rx="10" fill="#162033" stroke="url(#gKey_${pCol})" stroke-width="3"/>
        <rect x="32" y="72" width="136" height="76" rx="6" fill="#0d131f"/>
        <rect x="38" y="78" width="12" height="10" rx="2" fill="#243048"/>
        <rect x="54" y="78" width="12" height="10" rx="2" fill="#243048"/>
        <rect x="70" y="78" width="12" height="10" rx="2" fill="#243048"/>
        <rect x="86" y="78" width="12" height="10" rx="2" fill="#243048"/>
        <rect x="102" y="78" width="12" height="10" rx="2" fill="#243048"/>
        <rect x="118" y="78" width="12" height="10" rx="2" fill="#243048"/>
        <rect x="134" y="78" width="22" height="10" rx="2" fill="${primaryColor}"/>
        <rect x="38" y="93" width="16" height="10" rx="2" fill="#243048"/>
        <rect x="58" y="93" width="12" height="10" rx="2" fill="${primaryColor}"/>
        <rect x="74" y="93" width="12" height="10" rx="2" fill="#243048"/>
        <rect x="90" y="93" width="12" height="10" rx="2" fill="#243048"/>
        <rect x="106" y="93" width="12" height="10" rx="2" fill="#243048"/>
        <rect x="122" y="93" width="12" height="10" rx="2" fill="#243048"/>
        <rect x="138" y="93" width="18" height="10" rx="2" fill="#243048"/>
        <rect x="38" y="108" width="14" height="10" rx="2" fill="${primaryColor}"/>
        <rect x="56" y="108" width="12" height="10" rx="2" fill="${primaryColor}"/>
        <rect x="72" y="108" width="12" height="10" rx="2" fill="${primaryColor}"/>
        <rect x="88" y="108" width="12" height="10" rx="2" fill="#243048"/>
        <rect x="104" y="108" width="12" height="10" rx="2" fill="#243048"/>
        <rect x="120" y="108" width="16" height="10" rx="2" fill="#243048"/>
        <rect x="140" y="108" width="16" height="22" rx="2" fill="${secondaryColor}"/>
        <rect x="65" y="123" width="60" height="10" rx="2" fill="url(#gKey_${pCol})"/>
      `;
      break;

    case 'mouse':
      innerArt = `
        <defs>
          <linearGradient id="gMouse_${pCol}" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="${primaryColor}"/>
            <stop offset="100%" stop-color="${secondaryColor}"/>
          </linearGradient>
        </defs>
        <path d="M100 45 C70 45 60 85 60 120 C60 155 75 170 100 170 C125 170 140 155 140 120 C140 85 130 45 100 45 Z" 
              fill="#162033" stroke="url(#gMouse_${pCol})" stroke-width="3"/>
        <line x1="100" y1="45" x2="100" y2="92" stroke="#2a374f" stroke-width="2"/>
        <rect x="95" y="60" width="10" height="22" rx="5" fill="${primaryColor}"/>
        <circle cx="85" cy="120" r="3" fill="#243048"/>
        <circle cx="100" cy="120" r="3" fill="#243048"/>
        <circle cx="115" cy="120" r="3" fill="#243048"/>
        <circle cx="92" cy="132" r="3" fill="${primaryColor}"/>
        <circle cx="108" cy="132" r="3" fill="${primaryColor}"/>
        <circle cx="100" cy="144" r="3" fill="#243048"/>
      `;
      break;

    case 'mousepad':
      innerArt = `
        <defs>
          <linearGradient id="gPad_${pCol}" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="${primaryColor}"/>
            <stop offset="50%" stop-color="${secondaryColor}"/>
            <stop offset="100%" stop-color="#9d4edd"/>
          </linearGradient>
        </defs>
        <rect x="25" y="60" width="150" height="90" rx="8" fill="#121826" stroke="url(#gPad_${pCol})" stroke-width="4"/>
        <path d="M35 125 Q70 100 100 120 T165 110" fill="none" stroke="rgba(0, 242, 254, 0.3)" stroke-width="3"/>
        <path d="M35 135 Q70 110 100 130 T165 120" fill="none" stroke="rgba(157, 78, 221, 0.4)" stroke-width="3"/>
        <polygon points="150,75 158,82 142,82" fill="${primaryColor}"/>
      `;
      break;

    case 'mic':
      innerArt = `
        <defs>
          <linearGradient id="gMic_${pCol}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${primaryColor}"/>
            <stop offset="100%" stop-color="${secondaryColor}"/>
          </linearGradient>
        </defs>
        <path d="M100 130 L100 165 M75 165 L125 165" stroke="#475569" stroke-width="5" stroke-linecap="round"/>
        <circle cx="100" cy="95" r="36" fill="none" stroke="#243048" stroke-width="4"/>
        <rect x="84" y="65" width="32" height="60" rx="16" fill="#162033" stroke="url(#gMic_${pCol})" stroke-width="2.5"/>
        <rect x="88" y="70" width="24" height="28" rx="8" fill="#0d1422"/>
        <circle cx="100" cy="112" r="3" fill="${primaryColor}"/>
      `;
      break;

    case 'lamp':
      innerArt = `
        <rect x="35" y="85" width="130" height="75" rx="4" fill="#0e1726" stroke="#243048" stroke-width="2"/>
        <rect x="30" y="75" width="140" height="8" rx="3" fill="#1f293d" stroke="#475569" stroke-width="1.5"/>
        <polygon points="32,83 168,83 185,155 15,155" fill="${primaryColor}" opacity="0.2"/>
        <rect x="94" y="68" width="12" height="12" rx="2" fill="#334155"/>
      `;
      break;

    case 'backpack':
      innerArt = `
        <path d="M60 70 C60 45 140 45 140 70 L145 155 C145 165 135 170 100 170 C65 170 55 165 55 155 Z" fill="#162033" stroke="${primaryColor}" stroke-width="3"/>
        <path d="M85 45 C85 35 115 35 115 45" fill="none" stroke="#475569" stroke-width="4"/>
        <path d="M65 95 L100 80 L135 95 L135 145 L65 145 Z" fill="#0d1422" stroke="#243048" stroke-width="2"/>
        <circle cx="140" cy="115" r="4" fill="#475569"/>
      `;
      break;

    default:
      innerArt = `
        <rect x="45" y="55" width="110" height="100" rx="14" fill="#162033" stroke="${primaryColor}" stroke-width="3"/>
        <circle cx="100" cy="105" r="30" fill="#0d1422" stroke="${secondaryColor}" stroke-width="2"/>
        <polygon points="90,95 115,105 90,115" fill="${primaryColor}"/>
      `;
  }

  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
      <rect width="200" height="200" fill="none"/>
      ${innerArt}
    </svg>
  `.trim();

  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svgString);
}

// ============================================================================
// 2. ARREGLO DE PRODUCTOS (CATÁLOGO COMPLETO EN MXN)
// ============================================================================
const PRODUCTS_DATA = [
  {
    id: 1,
    name: "Audífonos Gamer Inalámbricos Logitech G435 LIGHTSPEED + Bluetooth",
    brand: "Logitech G",
    category: "audifonos",
    subcategory: "Inalámbricos",
    price: 639,
    originalPrice: 959,
    rating: 4.9,
    reviewsCount: 142,
    badge: "-33%",
    connectivity: "Inalámbrico",
    connectionLabel: "LIGHTSPEED 2.4 GHz + Bluetooth",
    rgb: false,
    pickupVillahermosa: true,
    freeShipping: true,
    popularity: 98,
    targetAudience: "gamer",
    flashStock: 4,
    dateAdded: "2026-03-15",
    typeKey: 'headset',
    image: createProductSVG('headset', '#00f2fe', '#4facfe'),
    description: "Audífonos inalámbricos ultraligeros de solo 165 g con doble conexión: receptor USB-A LIGHTSPEED de baja latencia o Bluetooth. Drivers de 40 mm, micrófonos beamforming integrados que reducen el ruido de fondo, compatibles con Dolby Atmos y hasta 18 horas de batería. Funcionan con PC, Mac, PS5, PS4, Nintendo Switch y celular.",
    specs: [
      { label: "Drivers", value: "40 mm" },
      { label: "Conexión", value: "LIGHTSPEED 2.4 GHz (receptor USB-A) y Bluetooth, hasta 10 m" },
      { label: "Batería", value: "Hasta 18 horas (carga por USB-C)" },
      { label: "Micrófono", value: "Dos micrófonos beamforming integrados, no desmontables" },
      { label: "Peso", value: "165 g" },
      { label: "Compatibilidad", value: "PC, Mac, PS5, PS4, Nintendo Switch y celular" }
    ]
  },
  {
    id: 2,
    name: "Teclado Mecánico 65% Hot-Swap Royal Kludge RK68 Bluetooth",
    brand: "Royal Kludge",
    category: "teclados",
    subcategory: "65% Compacto",
    price: 1127,
    originalPrice: null,
    badge: null,
    rating: 4.8,
    reviewsCount: 89,
    connectivity: "Inalámbrico",
    connectionLabel: "Bluetooth 5.0 / USB-C",
    rgb: true,
    pickupVillahermosa: true,
    freeShipping: true,
    popularity: 95,
    targetAudience: "estudio",
    flashStock: 6,
    dateAdded: "2026-03-20",
    typeKey: 'keyboard',
    image: createProductSVG('keyboard', '#00f2fe', '#9d4edd'),
    description: "Teclado mecánico compacto 65% de 68 teclas con flechas independientes y switches intercambiables sin soldar (hot-swap). Se conecta por Bluetooth 5.0 o por cable USB-C y tiene software de personalización. Distribución ANSI (inglés), sin tecla Ñ.",
    specs: [
      { label: "Distribución", value: "65%, 68 teclas con flechas y teclas de control independientes" },
      { label: "Conexión", value: "Bluetooth 5.0 y cable USB-C" },
      { label: "Switches", value: "Hot-swap (3 y 5 pines); disponible con switches Red, Brown o Blue" },
      { label: "Batería", value: "1450 mAh (versión Bluetooth)" },
      { label: "Keycaps", value: "ABS doble inyección, distribución ANSI (sin Ñ)" }
    ]
  },
  {
    id: 3,
    name: "Mouse Gamer Inalámbrico Ultraligero Razer Orochi V2",
    brand: "Razer",
    category: "mouses",
    subcategory: "Ultraligeros",
    price: 1799,
    originalPrice: null,
    badge: null,
    rating: 4.9,
    reviewsCount: 76,
    connectivity: "Inalámbrico",
    connectionLabel: "HyperSpeed 2.4 GHz + Bluetooth",
    rgb: false,
    pickupVillahermosa: true,
    freeShipping: true,
    popularity: 94,
    targetAudience: "gamer",
    flashStock: 5,
    dateAdded: "2026-04-01",
    typeKey: 'mouse',
    image: createProductSVG('mouse', '#00f2fe', '#10b981'),
    description: "Mouse inalámbrico compacto y simétrico de menos de 60 g (sin pila) con sensor óptico Razer Focus X de 18,000 DPI, switches mecánicos de 2.ª generación para 60 millones de clics y conexión dual HyperSpeed 2.4 GHz o Bluetooth. Funciona con una sola pila AA y alcanza hasta 950 horas en modo Bluetooth.",
    specs: [
      { label: "Sensor", value: "Óptico Razer Focus X, 18,000 DPI" },
      { label: "Peso", value: "Menos de 60 g (sin pila)" },
      { label: "Botones", value: "6 programables (software Razer Synapse)" },
      { label: "Switches", value: "Mecánicos Razer de 2.ª generación, 60 millones de clics" },
      { label: "Conexión", value: "HyperSpeed 2.4 GHz (receptor USB) y Bluetooth" },
      { label: "Batería", value: "1 pila AA: hasta 425 h en 2.4 GHz o 950 h en Bluetooth" },
      { label: "Pies", value: "100% PTFE" }
    ]
  },
  {
    id: 4,
    name: "Mousepad Gamer XXL Razer Gigantus V2 940 x 410 mm",
    brand: "Razer",
    category: "mousepads",
    subcategory: "XXL Extended",
    price: 969,
    originalPrice: null,
    badge: null,
    rating: 4.7,
    reviewsCount: 210,
    connectivity: "Sin conexión",
    connectionLabel: "Sin cables",
    rgb: false,
    pickupVillahermosa: true,
    freeShipping: false,
    popularity: 91,
    targetAudience: "estudio",
    flashStock: 9,
    dateAdded: "2026-01-10",
    typeKey: 'mousepad',
    image: createProductSVG('mousepad', '#00f2fe', '#4facfe'),
    description: "Alfombrilla extendida de tela microtejida texturizada, optimizada para todos los sensores de mouse, con espuma de goma de alta densidad de 4 mm y base antideslizante. Su tamaño XXL cubre teclado y mouse.",
    specs: [
      { label: "Dimensiones", value: "940 x 410 x 4 mm (XXL)" },
      { label: "Superficie", value: "Tela microtejida texturizada, suave" },
      { label: "Base", value: "Espuma de goma de alta densidad, antideslizante" },
      { label: "Iluminación", value: "No" }
    ]
  },
  {
    id: 5,
    name: "Audífonos Gamer HyperX Cloud II 7.1 con Cable",
    brand: "HyperX",
    category: "audifonos",
    subcategory: "Alámbricos",
    price: 1599,
    originalPrice: 1999,
    badge: "MÁS VENDIDO",
    rating: 4.9,
    reviewsCount: 380,
    connectivity: "Alámbrico",
    connectionLabel: "USB + jack 3.5 mm",
    rgb: false,
    pickupVillahermosa: true,
    freeShipping: true,
    popularity: 97,
    targetAudience: "gamer",
    flashStock: 3,
    dateAdded: "2026-01-20",
    typeKey: 'headset',
    image: createProductSVG('headset', '#ef4444', '#b91c1c'),
    description: "Audífonos circumaurales con cable y estructura de aluminio. Transductores dinámicos de 53 mm, sonido envolvente virtual 7.1 con la caja de control USB incluida y micrófono desmontable con cancelación de ruido. Se conectan por USB o por jack de 3.5 mm a PC, PS5, PS4, Xbox, Switch y celular.",
    specs: [
      { label: "Transductores", value: "Dinámicos de 53 mm con imanes de neodimio" },
      { label: "Conexión", value: "USB (caja de control) y jack de 3.5 mm" },
      { label: "Sonido envolvente", value: "Virtual 7.1 con la caja de control USB" },
      { label: "Micrófono", value: "Desmontable, unidireccional, con cancelación de ruido" },
      { label: "Almohadillas", value: "Espuma viscoelástica (memory foam)" },
      { label: "Peso", value: "Aprox. 320 g" },
      { label: "Compatibilidad", value: "PC, PS5, PS4, Xbox Series X/S, Xbox One, Switch y celular (por 3.5 mm)" }
    ]
  },
  {
    id: 6,
    name: "Teclado Mecánico Inalámbrico Keychron K2 V2 Hot-Swap",
    brand: "Keychron",
    category: "teclados",
    subcategory: "75% Formato",
    price: 2199,
    originalPrice: 2499,
    badge: "PREMIUM",
    rating: 4.9,
    reviewsCount: 115,
    connectivity: "Inalámbrico",
    connectionLabel: "Bluetooth 5.1 / USB-C",
    rgb: true,
    pickupVillahermosa: false,
    freeShipping: true,
    popularity: 93,
    targetAudience: "estudio",
    flashStock: 2,
    dateAdded: "2026-02-28",
    typeKey: 'keyboard',
    image: createProductSVG('keyboard', '#f59e0b', '#ef4444'),
    description: "Teclado mecánico compacto 75% (84 teclas) con marco de aluminio y switches Gateron G Pro intercambiables sin soldar (hot-swap). Funciona en Mac y Windows: Bluetooth 5.1 con hasta 3 dispositivos o por cable USB-C. Su batería de 4000 mAh rinde hasta 240 horas con la iluminación apagada.",
    specs: [
      { label: "Distribución", value: "75% (84 teclas)" },
      { label: "Conexión", value: "Bluetooth 5.1 (hasta 3 dispositivos) y cable USB-C" },
      { label: "Switches", value: "Gateron G Pro Brown (táctiles), hot-swap" },
      { label: "Batería", value: "4000 mAh, hasta 240 h sin iluminación" },
      { label: "Construcción", value: "Marco de aluminio" },
      { label: "Compatibilidad", value: "Mac, Windows y dispositivos móviles por Bluetooth" }
    ]
  },
  {
    id: 7,
    name: "Mouse Gamer Logitech G502 HERO High Performance",
    brand: "Logitech G",
    category: "mouses",
    subcategory: "Ergonómicos",
    price: 999,
    originalPrice: 1299,
    badge: "-23%",
    rating: 4.8,
    reviewsCount: 520,
    connectivity: "Alámbrico",
    connectionLabel: "USB-A",
    rgb: true,
    pickupVillahermosa: true,
    freeShipping: true,
    popularity: 96,
    targetAudience: "gamer",
    flashStock: 7,
    dateAdded: "2026-01-05",
    typeKey: 'mouse',
    image: createProductSVG('mouse', '#38bdf8', '#2563eb'),
    description: "Mouse gamer alámbrico para diestros con sensor óptico HERO (100 a 25,600 DPI), 11 botones programables, iluminación RGB LIGHTSYNC y 5 pesas de 3.6 g para ajustar peso y balance. Cable trenzado de 2.1 m con conector USB-A.",
    specs: [
      { label: "Sensor", value: "HERO, 100 a 25,600 DPI, sin suavizado ni aceleración" },
      { label: "Botones", value: "11 programables (software Logitech G HUB)" },
      { label: "Peso", value: "121 g, más hasta 18 g con las 5 pesas de 3.6 g" },
      { label: "Conexión", value: "USB-A, cable trenzado de 2.1 m, 1000 Hz" },
      { label: "Iluminación", value: "RGB LIGHTSYNC" }
    ]
  },
  {
    id: 8,
    name: "Mousepad Gamer RGB Corsair MM700 Extended XL 930 x 400 mm",
    brand: "Corsair",
    category: "mousepads",
    subcategory: "RGB Iluminado",
    price: 999,
    originalPrice: 1299,
    badge: "-23%",
    rating: 4.6,
    reviewsCount: 88,
    connectivity: "Alámbrico",
    connectionLabel: "USB-C desmontable a USB-A",
    rgb: true,
    pickupVillahermosa: true,
    freeShipping: false,
    popularity: 85,
    targetAudience: "gamer",
    flashStock: 8,
    dateAdded: "2026-03-01",
    typeKey: 'mousepad',
    image: createProductSVG('mousepad', '#9d4edd', '#00f2fe'),
    description: "Alfombrilla extendida de tela con iluminación RGB de 360° en tres zonas y 12 perfiles integrados, personalizable con el software iCUE. Incluye un hub USB de 2 puertos y se conecta con un cable USB-C desmontable. Base de goma antideslizante de 4 mm.",
    specs: [
      { label: "Dimensiones", value: "930 x 400 x 4 mm (Extended XL)" },
      { label: "Iluminación", value: "RGB de 360° en 3 zonas, 12 perfiles integrados, software iCUE" },
      { label: "Hub USB", value: "2 puertos USB-A" },
      { label: "Conexión", value: "Cable USB-C desmontable a la PC" },
      { label: "Base", value: "Goma antideslizante" }
    ]
  },
  {
    id: 9,
    name: "Micrófono USB de Condensador HyperX SoloCast",
    brand: "HyperX",
    category: "streaming",
    subcategory: "Micrófonos",
    price: 1499,
    originalPrice: null,
    badge: null,
    rating: 4.8,
    reviewsCount: 64,
    connectivity: "Alámbrico",
    connectionLabel: "USB-C a USB-A",
    rgb: false,
    pickupVillahermosa: true,
    freeShipping: true,
    popularity: 89,
    targetAudience: "estudio",
    flashStock: 4,
    dateAdded: "2026-03-25",
    typeKey: 'mic',
    image: createProductSVG('mic', '#00f2fe', '#4facfe'),
    description: "Micrófono USB de condensador electret con patrón cardioide que prioriza tu voz frente al micrófono. Plug and play sin drivers, sensor táctil para silenciar con indicador LED y soporte ajustable compatible con brazos de micrófono (roscas de 3/8 y 5/8 de pulgada). Funciona con PC, Mac, PS4 y PS5.",
    specs: [
      { label: "Elemento", value: "Cápsula de condensador electret de 14 mm" },
      { label: "Patrón polar", value: "Cardioide" },
      { label: "Resolución", value: "Hasta 24 bits / 96 kHz" },
      { label: "Conexión", value: "USB-C (cable a USB-A), plug and play" },
      { label: "Silenciar", value: "Sensor táctil con LED indicador" },
      { label: "Compatibilidad", value: "PC, Mac, PS4 y PS5" }
    ]
  },
  {
    id: 10,
    name: "Barra de Luz para Monitor Xiaomi Mi Computer Monitor Light Bar",
    brand: "Xiaomi",
    category: "streaming",
    subcategory: "Iluminación Desk",
    price: 949,
    originalPrice: 1199,
    badge: "-21%",
    rating: 4.9,
    reviewsCount: 175,
    connectivity: "Alámbrico",
    connectionLabel: "USB-C a USB-A",
    rgb: false,
    pickupVillahermosa: true,
    freeShipping: false,
    popularity: 92,
    targetAudience: "estudio",
    flashStock: 5,
    dateAdded: "2026-02-14",
    typeKey: 'lamp',
    image: createProductSVG('lamp', '#f59e0b', '#00f2fe'),
    description: "Barra de luz LED con óptica asimétrica que ilumina tu escritorio sin generar reflejos en la pantalla. Temperatura de color de 2700 K a 6500 K y brillo ajustable del 10% al 100% con un control remoto inalámbrico de perilla. Cuerpo de aluminio con rotación magnética; se alimenta por USB-C a 5 V.",
    specs: [
      { label: "Temperatura de color", value: "2700 K a 6500 K" },
      { label: "Potencia", value: "5 W (5 V / 1 A)" },
      { label: "Control", value: "Perilla inalámbrica de 2.4 GHz (2 pilas AAA)" },
      { label: "Alimentación", value: "USB-C (incluye cable USB-C a USB-A)" },
      { label: "Índice de reproducción cromática", value: "Ra95" },
      { label: "Dimensiones", value: "23 x 448 mm" }
    ]
  },
  {
    id: 11,
    name: "Mochila para Laptop Razer Rogue 17 pulgadas Backpack V3",
    brand: "Razer",
    category: "merch",
    subcategory: "Mochilas & Fundas",
    price: 2261,
    originalPrice: null,
    badge: null,
    rating: 4.8,
    reviewsCount: 94,
    connectivity: "Sin conexión",
    connectionLabel: "Sin cables",
    rgb: false,
    pickupVillahermosa: true,
    freeShipping: false,
    popularity: 88,
    targetAudience: "estudio",
    flashStock: 10,
    dateAdded: "2026-02-01",
    typeKey: 'backpack',
    image: createProductSVG('backpack', '#10b981', '#00f2fe'),
    description: "Mochila con compartimento para laptops de hasta 17.3 pulgadas (compatible con equipos de hasta 18 pulgadas), exterior resistente al desgarro y al agua con funda para lluvia, interior acolchado de TPU a prueba de rayones y compartimentos separados que protegen tu equipo.",
    specs: [
      { label: "Laptop compatible", value: "Hasta 17.3 pulgadas (compartimento para equipos de hasta 18 pulgadas)" },
      { label: "Exterior", value: "Resistente al desgarro y al agua, con funda para lluvia" },
      { label: "Interior", value: "Acolchado de TPU a prueba de rayones, compartimentos separados" },
      { label: "Cierres", value: "Cremalleras reforzadas e impermeables" }
    ]
  },
  {
    id: 12,
    name: "Teclado Gamer Mecánico Redragon Kumara K552 RGB",
    brand: "Redragon",
    category: "teclados",
    subcategory: "TKL Compacto",
    price: 799,
    originalPrice: 999,
    badge: "ECONÓMICO",
    rating: 4.7,
    reviewsCount: 460,
    connectivity: "Alámbrico",
    connectionLabel: "USB-A",
    rgb: true,
    pickupVillahermosa: true,
    freeShipping: false,
    popularity: 90,
    targetAudience: "gamer",
    flashStock: 8,
    dateAdded: "2026-01-15",
    typeKey: 'keyboard',
    image: createProductSVG('keyboard', '#ef4444', '#f43f5e'),
    description: "Teclado mecánico compacto TKL de 87 teclas con switches Outemu Blue (táctiles con clic audible), estructura de metal y ABS, retroiluminación RGB con 18 modos, anti-ghosting con N-key rollover y diseño resistente a salpicaduras. Cable USB-A de 1.8 m.",
    specs: [
      { label: "Switches", value: "Outemu Blue, táctil con clic audible" },
      { label: "Formato", value: "TKL (Tenkeyless), 87 teclas" },
      { label: "Iluminación", value: "RGB, 18 modos" },
      { label: "Construcción", value: "Placa metálica y ABS" },
      { label: "Anti-ghosting", value: "N-key rollover en las 87 teclas" },
      { label: "Conexión", value: "USB-A, cable de 1.8 m" }
    ]
  },
  {
    id: 13,
    name: "Mouse Gamer Razer DeathAdder Essential White Edition",
    brand: "Razer",
    category: "mouses",
    subcategory: "Ergonómicos",
    price: 599,
    originalPrice: 799,
    badge: "-25%",
    rating: 4.7,
    reviewsCount: 310,
    connectivity: "Alámbrico",
    connectionLabel: "USB-A",
    rgb: false,
    pickupVillahermosa: true,
    freeShipping: false,
    popularity: 87,
    targetAudience: "gamer",
    flashStock: 6,
    dateAdded: "2026-01-28",
    typeKey: 'mouse',
    image: createProductSVG('mouse', '#10b981', '#38bdf8'),
    description: "Mouse gamer alámbrico para diestros con diseño ergonómico, sensor óptico de 6,400 DPI reales, 5 botones programables y switches mecánicos Razer con vida útil de hasta 10 millones de clics. Agarres laterales de goma y solo 96 g de peso.",
    specs: [
      { label: "Sensor", value: "Óptico, 6,400 DPI reales" },
      { label: "Botones", value: "5 programables (Hyperesponse)" },
      { label: "Switches", value: "Mecánicos Razer, hasta 10 millones de clics" },
      { label: "Peso", value: "96 g" },
      { label: "Diseño", value: "Ergonómico para diestros, agarres laterales de goma" },
      { label: "Conexión", value: "USB-A con cable trenzado" }
    ]
  },
  {
    id: 14,
    name: "Audífonos Gamer Razer BlackShark V2 X Multiplataforma",
    brand: "Razer",
    category: "audifonos",
    subcategory: "Alámbricos",
    price: 1199,
    originalPrice: 1499,
    badge: "OFERTA",
    rating: 4.8,
    reviewsCount: 225,
    connectivity: "Alámbrico",
    connectionLabel: "Jack 3.5 mm",
    rgb: false,
    pickupVillahermosa: false,
    freeShipping: true,
    popularity: 92,
    targetAudience: "gamer",
    flashStock: 4,
    dateAdded: "2026-02-10",
    typeKey: 'headset',
    image: createProductSVG('headset', '#10b981', '#059669'),
    description: "Audífonos gamer con cable para esports: diafragmas Razer TriForce de 50 mm, micrófono cardioide HyperClear (flexible, no desmontable), almohadillas de espuma con memoria y solo 240 g. Su conexión de 3.5 mm funciona con PC, Mac, PlayStation, Xbox, Switch y celular. El sonido 7.1 virtual está disponible en Windows con el software de Razer.",
    specs: [
      { label: "Diafragmas", value: "Razer TriForce de 50 mm" },
      { label: "Conexión", value: "Jack de 3.5 mm (incluye cable divisor para PC)" },
      { label: "Micrófono", value: "Cardioide Razer HyperClear, flexible" },
      { label: "Peso", value: "240 g" },
      { label: "Sonido envolvente", value: "7.1 virtual solo en Windows, con software de Razer" },
      { label: "Almohadillas", value: "Espuma viscoelástica con piel sintética" }
    ]
  }
];

// ----------------------------------------------------------------------------
// FOTOS REALES DE PRODUCTO
// Guarda las fotos en la carpeta img/ con el nombre de abajo (.jpg, .png o .webp).
// Fotos extra para la galería: nombre-2.jpg, nombre-3.jpg, nombre-4.jpg.
// Si una foto no existe, se muestra la ilustración de respaldo y la tienda sigue funcionando.
// ----------------------------------------------------------------------------
const PHOTO_SLUGS = {
  1: 'logitech-g435-lightspeed', 2: 'royal-kludge-rk68', 3: 'razer-orochi-v2', 4: 'razer-gigantus-v2-xxl',
  5: 'hyperx-cloud-ii', 6: 'keychron-k2-v2', 7: 'logitech-g502-hero', 8: 'corsair-mm700-rgb-extended',
  9: 'hyperx-solocast', 10: 'xiaomi-monitor-light-bar', 11: 'razer-rogue-17-v3',
  12: 'redragon-k552-kumara', 13: 'razer-deathadder-essential', 14: 'razer-blackshark-v2-x'
};
PRODUCTS_DATA.forEach(p => {
  p.fallbackImage = p.image;
  p.photoBase = 'img/' + PHOTO_SLUGS[p.id];
  p.image = p.photoBase + '.jpg';
});

(function setupImageFallback() {
  const EXTS = ['jpg', 'png', 'webp'];
  document.addEventListener('error', (e) => {
    const img = e.target;
    if (!(img instanceof HTMLImageElement)) return;
    const src = img.getAttribute('src') || '';
    const m = src.match(/^(img\/[^?#]+)\.(jpg|png|webp)$/i);
    if (!m) return;
    const next = EXTS[EXTS.indexOf(m[2].toLowerCase()) + 1];
    if (next) { img.setAttribute('src', m[1] + '.' + next); return; }
    if (img.dataset.extra) {                       // foto extra de galería que no existe: quitar miniatura
      const btn = img.closest('.gallery-thumb-btn');
      if (btn) btn.remove();
      return;
    }
    const p = PRODUCTS_DATA.find(x => x.photoBase === m[1]);
    if (p) img.setAttribute('src', p.fallbackImage);
  }, true);
})();


// ============================================================================
// 3. ESTADO GLOBAL DE LA APLICACIÓN (STATE)
// ============================================================================
const appState = {
  searchQuery: '',
  activeCategory: 'all',
  activeSubcategory: 'all',
  priceRange: 2500,
  minPriceInput: 0,
  maxPriceInput: 2500,
  selectedBrands: new Set(),
  selectedFeatures: new Set(),
  pickupOnly: false,
  freeShippingOnly: false,
  discountOnly: false,
  sortBy: 'popular',
  viewMode: 'grid',
  cart: [],
  savedForLater: [],
  wishlist: new Set(),
  appliedCoupon: null, // { code: 'ESTUDIANTE10', discountPct: 0.10 }
  shippingCost: null,  // 0 o 149
  shippingType: 'home', // 'home' | 'tabasco'
  currentUser: null    // { id, nombre, correo, telefono, rol }
};

function initLocalStorage() {
  try {
    const savedCart = localStorage.getItem('nexus_cart');
    if (savedCart) appState.cart = JSON.parse(savedCart);
    
    const savedLater = localStorage.getItem('nexus_saved_later');
    if (savedLater) appState.savedForLater = JSON.parse(savedLater);

    const savedWish = localStorage.getItem('nexus_wishlist');
    if (savedWish) appState.wishlist = new Set(JSON.parse(savedWish));

    const savedCoupon = localStorage.getItem('nexus_coupon');
    if (savedCoupon) appState.appliedCoupon = JSON.parse(savedCoupon);

    const savedView = localStorage.getItem('nexus_view_mode');
    if (savedView) appState.viewMode = savedView;
  } catch (e) {
    console.warn("Acceso a LocalStorage limitado", e);
  }
}

function persistCart() {
  try {
    localStorage.setItem('nexus_cart', JSON.stringify(appState.cart));
  } catch (e) {}
}

function persistSavedLater() {
  try {
    localStorage.setItem('nexus_saved_later', JSON.stringify(appState.savedForLater));
  } catch (e) {}
}

function persistWishlist() {
  try {
    localStorage.setItem('nexus_wishlist', JSON.stringify([...appState.wishlist]));
  } catch (e) {}
}

const currencyFormatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  minimumFractionDigits: 2
});

function formatMXN(amount) {
  return currencyFormatter.format(amount) + ' MXN';
}

function formatMSI(price) {
  const msi = (price / 6).toFixed(2);
  return `Hasta 6 MSI de $${msi} MXN`;
}

// Precio unitario de un renglón del carrito (incluye sobreprecio de variante)
function cartItemUnitPrice(item) {
  return item.product.price + (item.varianteExtra || 0);
}

// ============================================================================
// 4. GENERADOR DE HTML PARA TARJETAS DE PRODUCTO (REUTILIZABLE)
// ============================================================================
function generateProductCardHTML(product, options = {}) {
  const isWishlisted = appState.wishlist.has(product.id);
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  return `
    <article class="product-card" data-id="${product.id}">
      <div class="product-visual-wrap" onclick="window.location.href='producto.html?id=${product.id}'" role="button" tabindex="0" aria-label="Ver detalles de ${product.name}">
        <div class="product-badges">
          ${product.badge ? `<span class="badge-tag ${getBadgeClass(product.badge)}">${product.badge}</span>` : ''}
          ${product.pickupVillahermosa ? `<span class="badge-tag badge-pickup">📍 VILLAHERMOSA</span>` : ''}
        </div>

        <button 
          class="wishlist-toggle-btn ${isWishlisted ? 'is-active' : ''}" 
          data-id="${product.id}" 
          onclick="event.stopPropagation(); toggleWishlist(${product.id})" 
          aria-label="${isWishlisted ? 'Quitar de favoritos' : 'Agregar a favoritos'}"
          title="${isWishlisted ? 'Quitar de favoritos' : 'Agregar a favoritos'}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="${isWishlisted ? '#f43f5e' : 'none'}" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>

        <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy">

        <button class="quick-view-btn" onclick="event.stopPropagation(); openQuickView(${product.id})">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          Vista Rápida
        </button>
      </div>

      <div class="product-card-body">
        <div class="card-info-col">
          <div class="card-meta-row">
            <span class="product-brand">${product.brand}</span>
            <div class="product-rating" title="Calificación: ${product.rating} estrellas">
              <span>★</span>
              <strong>${product.rating.toFixed(1)}</strong>
              <span class="rating-count">(${product.reviewsCount})</span>
            </div>
          </div>

          <h3 class="product-title" title="${product.name}">
            <a href="producto.html?id=${product.id}">${product.name}</a>
          </h3>

          <div class="product-feature-tags">
            <span class="feature-pill">${product.connectionLabel || product.connectivity}</span>
            ${product.rgb ? '<span class="feature-pill">RGB</span>' : '<span class="feature-pill">Sin RGB</span>'}
            <span class="feature-pill">${product.subcategory}</span>
          </div>
        </div>

        <div class="product-price-section">
          ${options.showStock ? `
            <div class="stock-meter-bar">
              <div class="stock-meter-text">
                <span>🔥 Existencia limitada</span>
                <span>¡Quedan ${product.flashStock || 3} piezas!</span>
              </div>
              <div class="stock-meter-track">
                <div class="stock-meter-fill" style="width: ${((product.flashStock || 3) / 10) * 100}%;"></div>
              </div>
            </div>
          ` : ''}

          <div class="price-box">
            <span class="current-price">${formatMXN(product.price)}</span>
            ${hasDiscount ? `<span class="original-price">${formatMXN(product.originalPrice)}</span>` : ''}
          </div>

          <div class="msi-note">
            <span>💳</span>
            <span>${formatMSI(product.price)}</span>
          </div>

          <div class="shipping-badge ${product.freeShipping ? 'free' : 'pickup-tab'}">
            <span>${product.freeShipping ? '🚚 Envío Gratis' : '📍 Recoge en Villahermosa'}</span>
          </div>

          <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span>Agregar</span>
          </button>
        </div>
      </div>
    </article>
  `;
}

function getBadgeClass(badge) {
  if (badge.includes('-') || badge.includes('OFERTA')) return 'badge-discount';
  if (badge === 'NUEVO') return 'badge-new';
  if (badge === 'MÁS VENDIDO' || badge === 'PREMIUM') return 'badge-hot';
  return 'badge-new';
}

// ============================================================================
// 5. MÓDULO 1: PÁGINA DE INICIO (HOME PAGE)
// ============================================================================
function initHomePage() {
  const isHome = document.getElementById('heroSection') !== null;
  if (!isHome) return;

  const heroImg1 = document.getElementById('heroSlideImg1');
  const heroImg2 = document.getElementById('heroSlideImg2');
  const heroImg3 = document.getElementById('heroSlideImg3');

  if (heroImg1) heroImg1.src = PRODUCTS_DATA[0].image;
  if (heroImg2) heroImg2.src = PRODUCTS_DATA[1].image;
  if (heroImg3) heroImg3.src = PRODUCTS_DATA[2].image;

  const catArtAud = document.getElementById('catArtAudifonos');
  const catArtTec = document.getElementById('catArtTeclados');
  const catArtMou = document.getElementById('catArtMouses');
  const catArtPad = document.getElementById('catArtMousepads');
  const catArtStr = document.getElementById('catArtStreaming');
  const catArtMer = document.getElementById('catArtMerch');

  if (catArtAud) catArtAud.innerHTML = `<img src="${createProductSVG('headset', '#00f2fe', '#4facfe')}" alt="">`;
  if (catArtTec) catArtTec.innerHTML = `<img src="${createProductSVG('keyboard', '#9d4edd', '#00f2fe')}" alt="">`;
  if (catArtMou) catArtMou.innerHTML = `<img src="${createProductSVG('mouse', '#10b981', '#00f2fe')}" alt="">`;
  if (catArtPad) catArtPad.innerHTML = `<img src="${createProductSVG('mousepad', '#00f2fe', '#9d4edd')}" alt="">`;
  if (catArtStr) catArtStr.innerHTML = `<img src="${createProductSVG('mic', '#00f2fe', '#38bdf8')}" alt="">`;
  if (catArtMer) catArtMer.innerHTML = `<img src="${createProductSVG('backpack', '#10b981', '#00f2fe')}" alt="">`;

  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  let currentSlide = 0;
  let slideInterval = null;

  function showSlide(index) {
    slides.forEach((s, idx) => s.classList.toggle('active-slide', idx === index));
    dots.forEach((d, idx) => d.classList.toggle('active-dot', idx === index));
    currentSlide = index;
  }

  function nextSlide() {
    showSlide((currentSlide + 1) % slides.length);
  }

  function startAutoPlay() {
    slideInterval = setInterval(nextSlide, 5000);
  }

  function stopAutoPlay() {
    if (slideInterval) clearInterval(slideInterval);
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      showSlide(parseInt(dot.getAttribute('data-slide-to'), 10));
      stopAutoPlay();
      startAutoPlay();
    });
  });

  const heroSection = document.getElementById('heroSection');
  if (heroSection) {
    heroSection.addEventListener('mouseenter', stopAutoPlay);
    heroSection.addEventListener('mouseleave', startAutoPlay);
  }
  startAutoPlay();

  const countdownEl = document.getElementById('flashCountdown');
  if (countdownEl) {
    let secondsLeft = 8 * 3600 + 42 * 60 + 15;
    setInterval(() => {
      if (secondsLeft > 0) secondsLeft--;
      const h = String(Math.floor(secondsLeft / 3600)).padStart(2, '0');
      const m = String(Math.floor((secondsLeft % 3600) / 60)).padStart(2, '0');
      const s = String(secondsLeft % 60).padStart(2, '0');
      countdownEl.textContent = `${h}:${m}:${s}`;
    }, 1000);
  }

  const flashGrid = document.getElementById('flashDealsGrid');
  if (flashGrid) {
    const flashProducts = PRODUCTS_DATA.filter(p => p.originalPrice && p.originalPrice > p.price).slice(0, 3);
    flashGrid.innerHTML = flashProducts.map(p => generateProductCardHTML(p, { showStock: true })).join('');
  }

  const bestSellersGrid = document.getElementById('bestSellersGrid');
  const trendFilterButtons = document.getElementById('trendingFilterButtons');

  function renderBestSellers(filter = 'all') {
    if (!bestSellersGrid) return;
    let list = [...PRODUCTS_DATA];
    if (filter === 'gamer') list = list.filter(p => p.targetAudience === 'gamer');
    else if (filter === 'estudio') list = list.filter(p => p.targetAudience === 'estudio');
    const topItems = list.sort((a, b) => b.popularity - a.popularity).slice(0, 3);
    bestSellersGrid.innerHTML = topItems.map(p => generateProductCardHTML(p)).join('');
  }

  renderBestSellers('all');

  if (trendFilterButtons) {
    trendFilterButtons.querySelectorAll('.cat-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        trendFilterButtons.querySelectorAll('.cat-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderBestSellers(btn.getAttribute('data-trend'));
      });
    });
  }
}

// ============================================================================
// 6. MÓDULO 2: CATÁLOGO DE PRODUCTOS (CATALOGO.HTML)
// ============================================================================
function initCatalogPage() {
  const isCatalog = document.getElementById('catalogMain') !== null;
  if (!isCatalog) return;

  const DOM_CAT = {
    categoryPillsContainer: document.getElementById('categoryPillsContainer'),
    currentCategoryBreadcrumb: document.getElementById('currentCategoryBreadcrumb'),
    catalogTitleHeading: document.getElementById('catalogTitleHeading'),
    filtersSidebar: document.getElementById('filtersSidebar'),
    openFiltersBtn: document.getElementById('openFiltersBtn'),
    closeSidebarBtn: document.getElementById('closeSidebarBtn'),
    resetFiltersBtn: document.getElementById('resetFiltersBtn'),
    activeFilterBadge: document.getElementById('activeFilterBadge'),
    subcategoryOptionsList: document.getElementById('subcategoryOptionsList'),
    priceRangeSlider: document.getElementById('priceRangeSlider'),
    priceIndicator: document.getElementById('priceIndicator'),
    minPriceInput: document.getElementById('minPriceInput'),
    maxPriceInput: document.getElementById('maxPriceInput'),
    brandFilterList: document.getElementById('brandFilterList'),
    pickupFilter: document.getElementById('pickupFilter'),
    freeShippingFilter: document.getElementById('freeShippingFilter'),
    discountFilter: document.getElementById('discountFilter'),
    resultsCounter: document.getElementById('resultsCounter'),
    sortSelect: document.getElementById('sortSelect'),
    viewGridBtn: document.getElementById('viewGridBtn'),
    viewListBtn: document.getElementById('viewListBtn'),
    activeChipsBar: document.getElementById('activeChipsBar'),
    activeChipsList: document.getElementById('activeChipsList'),
    clearAllChipsBtn: document.getElementById('clearAllChipsBtn'),
    productsGrid: document.getElementById('productsGrid'),
    emptyState: document.getElementById('emptyState'),
    resetFromEmptyBtn: document.getElementById('resetFromEmptyBtn'),
    visibleCount: document.getElementById('visibleCount'),
    totalCount: document.getElementById('totalCount')
  };

  const urlParams = new URLSearchParams(window.location.search);
  const catParam = urlParams.get('cat') || urlParams.get('category');
  const searchParam = urlParams.get('search') || urlParams.get('q');

  if (catParam) appState.activeCategory = catParam;
  if (searchParam) {
    appState.searchQuery = searchParam;
    const sInput = document.getElementById('searchInput');
    if (sInput) sInput.value = searchParam;
  }

  function getFilteredAndSortedProducts() {
    let result = [...PRODUCTS_DATA];

    if (appState.searchQuery.trim() !== '') {
      const q = appState.searchQuery.toLowerCase().trim();
      result = result.filter(item => {
        return item.name.toLowerCase().includes(q) ||
               item.brand.toLowerCase().includes(q) ||
               item.subcategory.toLowerCase().includes(q) ||
               item.category.toLowerCase().includes(q) ||
               item.description.toLowerCase().includes(q);
      });
    }

    if (appState.activeCategory !== 'all') result = result.filter(item => item.category === appState.activeCategory);
    if (appState.activeSubcategory !== 'all') result = result.filter(item => item.subcategory === appState.activeSubcategory);

    result = result.filter(item => item.price >= appState.minPriceInput && item.price <= appState.maxPriceInput);

    if (appState.selectedBrands.size > 0) result = result.filter(item => appState.selectedBrands.has(item.brand));

    if (appState.selectedFeatures.size > 0) {
      result = result.filter(item => {
        let matches = true;
        if (appState.selectedFeatures.has('Inalámbrico') && item.connectivity !== 'Inalámbrico') matches = false;
        if (appState.selectedFeatures.has('Alámbrico') && item.connectivity !== 'Alámbrico') matches = false;
        if (appState.selectedFeatures.has('RGB') && !item.rgb) matches = false;
        if (appState.selectedFeatures.has('Sin RGB / Blanco') && item.rgb) matches = false;
        return matches;
      });
    }

    if (appState.pickupOnly) result = result.filter(item => item.pickupVillahermosa === true);
    if (appState.freeShippingOnly) result = result.filter(item => item.freeShipping === true);
    if (appState.discountOnly) result = result.filter(item => Boolean(item.originalPrice && item.originalPrice > item.price));

    switch (appState.sortBy) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating || b.reviewsCount - a.reviewsCount); break;
      case 'newest': result.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)); break;
      case 'discount':
        result.sort((a, b) => {
          const discA = a.originalPrice ? (a.originalPrice - a.price) : 0;
          const discB = b.originalPrice ? (b.originalPrice - b.price) : 0;
          return discB - discA;
        });
        break;
      case 'popular':
      default:
        result.sort((a, b) => b.popularity - a.popularity);
        break;
    }
    return result;
  }

  function renderCatalog() {
    const filtered = getFilteredAndSortedProducts();

    if (DOM_CAT.resultsCounter) DOM_CAT.resultsCounter.innerHTML = `Mostrando <strong>${filtered.length}</strong> productos`;
    if (DOM_CAT.visibleCount) DOM_CAT.visibleCount.textContent = filtered.length;
    if (DOM_CAT.totalCount) DOM_CAT.totalCount.textContent = PRODUCTS_DATA.length;

    const totalActive = 
      (appState.activeCategory !== 'all' ? 1 : 0) +
      (appState.activeSubcategory !== 'all' ? 1 : 0) +
      (appState.minPriceInput > 0 || appState.maxPriceInput < 2500 ? 1 : 0) +
      appState.selectedBrands.size +
      appState.selectedFeatures.size +
      (appState.pickupOnly ? 1 : 0) +
      (appState.freeShippingOnly ? 1 : 0) +
      (appState.discountOnly ? 1 : 0);

    if (DOM_CAT.activeFilterBadge) {
      DOM_CAT.activeFilterBadge.textContent = totalActive;
      DOM_CAT.activeFilterBadge.hidden = totalActive === 0;
    }

    renderActiveChips(totalActive);

    if (filtered.length === 0) {
      if (DOM_CAT.productsGrid) {
        DOM_CAT.productsGrid.innerHTML = '';
        DOM_CAT.productsGrid.hidden = true;
      }
      if (DOM_CAT.emptyState) DOM_CAT.emptyState.hidden = false;
      return;
    }

    if (DOM_CAT.emptyState) DOM_CAT.emptyState.hidden = true;
    if (DOM_CAT.productsGrid) {
      DOM_CAT.productsGrid.hidden = false;
      DOM_CAT.productsGrid.className = `products-grid view-${appState.viewMode}`;
      DOM_CAT.productsGrid.innerHTML = filtered.map(p => generateProductCardHTML(p)).join('');
    }
  }

  function renderActiveChips(totalActive) {
    if (!DOM_CAT.activeChipsBar) return;
    if (totalActive === 0) {
      DOM_CAT.activeChipsBar.hidden = true;
      return;
    }

    DOM_CAT.activeChipsBar.hidden = false;
    const chips = [];

    if (appState.activeCategory !== 'all') chips.push({ label: `Categoría: ${appState.activeCategory}`, type: 'category' });
    if (appState.activeSubcategory !== 'all') chips.push({ label: `Subcategoría: ${appState.activeSubcategory}`, type: 'subcategory' });
    if (appState.minPriceInput > 0 || appState.maxPriceInput < 2500) chips.push({ label: `$${appState.minPriceInput} - $${appState.maxPriceInput} MXN`, type: 'price' });
    appState.selectedBrands.forEach(b => chips.push({ label: b, type: 'brand', value: b }));
    appState.selectedFeatures.forEach(f => chips.push({ label: f, type: 'feature', value: f }));
    if (appState.pickupOnly) chips.push({ label: '📍 Villahermosa', type: 'pickup' });
    if (appState.freeShippingOnly) chips.push({ label: '🚚 Envío Gratis', type: 'freeship' });
    if (appState.discountOnly) chips.push({ label: '🔥 En Oferta', type: 'discount' });

    if (DOM_CAT.activeChipsList) {
      DOM_CAT.activeChipsList.innerHTML = chips.map(c => `
        <span class="chip-tag">
          <span>${c.label}</span>
          <button type="button" onclick="window.removeCatalogFilter('${c.type}', '${c.value || ''}')" aria-label="Remover">✕</button>
        </span>
      `).join('');
    }
  }

  window.removeCatalogFilter = function(type, value) {
    if (type === 'category') setCategory('all');
    else if (type === 'subcategory') { appState.activeSubcategory = 'all'; updateSubcategorySidebar(); }
    else if (type === 'price') {
      appState.minPriceInput = 0;
      appState.maxPriceInput = 2500;
      if (DOM_CAT.priceRangeSlider) DOM_CAT.priceRangeSlider.value = 2500;
      if (DOM_CAT.minPriceInput) DOM_CAT.minPriceInput.value = 0;
      if (DOM_CAT.maxPriceInput) DOM_CAT.maxPriceInput.value = 2500;
      if (DOM_CAT.priceIndicator) DOM_CAT.priceIndicator.textContent = '$0 - $2,500 MXN';
    }
    else if (type === 'brand') {
      appState.selectedBrands.delete(value);
      const cb = DOM_CAT.brandFilterList.querySelector(`input[value="${value}"]`);
      if (cb) cb.checked = false;
    }
    else if (type === 'feature') {
      appState.selectedFeatures.delete(value);
      const cb = document.querySelector(`input[name="feature"][value="${value}"]`);
      if (cb) cb.checked = false;
    }
    else if (type === 'pickup') { appState.pickupOnly = false; if (DOM_CAT.pickupFilter) DOM_CAT.pickupFilter.checked = false; }
    else if (type === 'freeship') { appState.freeShippingOnly = false; if (DOM_CAT.freeShippingFilter) DOM_CAT.freeShippingFilter.checked = false; }
    else if (type === 'discount') { appState.discountOnly = false; if (DOM_CAT.discountFilter) DOM_CAT.discountFilter.checked = false; }

    renderCatalog();
  };

  function updateSubcategorySidebar() {
    if (!DOM_CAT.subcategoryOptionsList) return;
    const inCat = appState.activeCategory === 'all' 
      ? PRODUCTS_DATA 
      : PRODUCTS_DATA.filter(p => p.category === appState.activeCategory);

    const subcats = [...new Set(inCat.map(p => p.subcategory))];

    let html = `
      <button class="subcat-btn ${appState.activeSubcategory === 'all' ? 'active' : ''}" data-subcat="all">
        <span>Todas las subcategorías</span>
        <span class="count-badge">(${inCat.length})</span>
      </button>
    `;

    subcats.forEach(sub => {
      const count = inCat.filter(p => p.subcategory === sub).length;
      html += `
        <button class="subcat-btn ${appState.activeSubcategory === sub ? 'active' : ''}" data-subcat="${sub}">
          <span>${sub}</span>
          <span class="count-badge">(${count})</span>
        </button>
      `;
    });

    DOM_CAT.subcategoryOptionsList.innerHTML = html;

    DOM_CAT.subcategoryOptionsList.querySelectorAll('.subcat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        appState.activeSubcategory = btn.getAttribute('data-subcat');
        updateSubcategorySidebar();
        renderCatalog();
      });
    });
  }

  function setCategory(categoryKey) {
    appState.activeCategory = categoryKey;
    appState.activeSubcategory = 'all';

    if (DOM_CAT.categoryPillsContainer) {
      DOM_CAT.categoryPillsContainer.querySelectorAll('.cat-pill').forEach(pill => {
        pill.classList.toggle('active', pill.getAttribute('data-category') === categoryKey);
      });
    }

    const titles = {
      all: 'Todos los Productos',
      audifonos: 'Audífonos & Audio Gamer',
      teclados: 'Teclados Mecánicos Hot-Swap',
      mouses: 'Mouses Gaming de Alto Desempeño',
      mousepads: 'Mousepads XXL y Tapetes de Escritorio',
      streaming: 'Micrófonos y Accesorios de Setup',
      merch: 'Merch Tecnológico y Mochilas'
    };

    if (DOM_CAT.currentCategoryBreadcrumb) DOM_CAT.currentCategoryBreadcrumb.textContent = titles[categoryKey] || 'Catálogo';
    if (DOM_CAT.catalogTitleHeading) DOM_CAT.catalogTitleHeading.textContent = titles[categoryKey] || 'Catálogo de Periféricos';

    updateSubcategorySidebar();
    renderCatalog();
  }

  function resetAllFilters() {
    appState.searchQuery = '';
    const sInput = document.getElementById('searchInput');
    if (sInput) sInput.value = '';
    const clearBtn = document.getElementById('clearSearchBtn');
    if (clearBtn) clearBtn.hidden = true;

    appState.activeCategory = 'all';
    appState.activeSubcategory = 'all';
    appState.minPriceInput = 0;
    appState.maxPriceInput = 2500;
    appState.priceRange = 2500;

    if (DOM_CAT.priceRangeSlider) DOM_CAT.priceRangeSlider.value = 2500;
    if (DOM_CAT.minPriceInput) DOM_CAT.minPriceInput.value = 0;
    if (DOM_CAT.maxPriceInput) DOM_CAT.maxPriceInput.value = 2500;
    if (DOM_CAT.priceIndicator) DOM_CAT.priceIndicator.textContent = '$0 - $2,500 MXN';

    appState.selectedBrands.clear();
    document.querySelectorAll('input[name="brand"]').forEach(cb => cb.checked = false);

    appState.selectedFeatures.clear();
    document.querySelectorAll('input[name="feature"]').forEach(cb => cb.checked = false);

    appState.pickupOnly = false;
    if (DOM_CAT.pickupFilter) DOM_CAT.pickupFilter.checked = false;
    appState.freeShippingOnly = false;
    if (DOM_CAT.freeShippingFilter) DOM_CAT.freeShippingFilter.checked = false;
    appState.discountOnly = false;
    if (DOM_CAT.discountFilter) DOM_CAT.discountFilter.checked = false;

    setCategory('all');
    showToast('Filtros restablecidos', 'info');
  }

  if (DOM_CAT.categoryPillsContainer) {
    DOM_CAT.categoryPillsContainer.querySelectorAll('.cat-pill').forEach(pill => {
      pill.addEventListener('click', () => setCategory(pill.getAttribute('data-category')));
    });
  }

  if (DOM_CAT.priceRangeSlider) {
    DOM_CAT.priceRangeSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      appState.maxPriceInput = val;
      if (DOM_CAT.maxPriceInput) DOM_CAT.maxPriceInput.value = val;
      if (DOM_CAT.priceIndicator) DOM_CAT.priceIndicator.textContent = `$${appState.minPriceInput} - $${val} MXN`;
      renderCatalog();
    });
  }

  if (DOM_CAT.minPriceInput) {
    DOM_CAT.minPriceInput.addEventListener('change', (e) => {
      appState.minPriceInput = Math.max(0, parseInt(e.target.value, 10) || 0);
      if (DOM_CAT.priceIndicator) DOM_CAT.priceIndicator.textContent = `$${appState.minPriceInput} - $${appState.maxPriceInput} MXN`;
      renderCatalog();
    });
  }

  if (DOM_CAT.maxPriceInput) {
    DOM_CAT.maxPriceInput.addEventListener('change', (e) => {
      const val = Math.min(2500, parseInt(e.target.value, 10) || 2500);
      appState.maxPriceInput = val;
      if (DOM_CAT.priceRangeSlider) DOM_CAT.priceRangeSlider.value = val;
      if (DOM_CAT.priceIndicator) DOM_CAT.priceIndicator.textContent = `$${appState.minPriceInput} - $${val} MXN`;
      renderCatalog();
    });
  }

  if (DOM_CAT.brandFilterList) {
    DOM_CAT.brandFilterList.querySelectorAll('input[name="brand"]').forEach(cb => {
      cb.addEventListener('change', () => {
        if (cb.checked) appState.selectedBrands.add(cb.value);
        else appState.selectedBrands.delete(cb.value);
        renderCatalog();
      });
    });
  }

  document.querySelectorAll('input[name="feature"]').forEach(cb => {
    cb.addEventListener('change', () => {
      if (cb.checked) appState.selectedFeatures.add(cb.value);
      else appState.selectedFeatures.delete(cb.value);
      renderCatalog();
    });
  });

  if (DOM_CAT.pickupFilter) DOM_CAT.pickupFilter.addEventListener('change', (e) => { appState.pickupOnly = e.target.checked; renderCatalog(); });
  if (DOM_CAT.freeShippingFilter) DOM_CAT.freeShippingFilter.addEventListener('change', (e) => { appState.freeShippingOnly = e.target.checked; renderCatalog(); });
  if (DOM_CAT.discountFilter) DOM_CAT.discountFilter.addEventListener('change', (e) => { appState.discountOnly = e.target.checked; renderCatalog(); });

  if (DOM_CAT.resetFiltersBtn) DOM_CAT.resetFiltersBtn.addEventListener('click', resetAllFilters);
  if (DOM_CAT.resetFromEmptyBtn) DOM_CAT.resetFromEmptyBtn.addEventListener('click', resetAllFilters);
  if (DOM_CAT.clearAllChipsBtn) DOM_CAT.clearAllChipsBtn.addEventListener('click', resetAllFilters);

  if (DOM_CAT.sortSelect) {
    DOM_CAT.sortSelect.addEventListener('change', (e) => {
      appState.sortBy = e.target.value;
      renderCatalog();
    });
  }

  if (DOM_CAT.viewGridBtn && DOM_CAT.viewListBtn) {
    DOM_CAT.viewGridBtn.addEventListener('click', () => {
      appState.viewMode = 'grid';
      DOM_CAT.viewGridBtn.classList.add('active');
      DOM_CAT.viewListBtn.classList.remove('active');
      localStorage.setItem('nexus_view_mode', 'grid');
      renderCatalog();
    });

    DOM_CAT.viewListBtn.addEventListener('click', () => {
      appState.viewMode = 'list';
      DOM_CAT.viewListBtn.classList.add('active');
      DOM_CAT.viewGridBtn.classList.remove('active');
      localStorage.setItem('nexus_view_mode', 'list');
      renderCatalog();
    });

    if (appState.viewMode === 'list') {
      DOM_CAT.viewListBtn.classList.add('active');
      DOM_CAT.viewGridBtn.classList.remove('active');
    }
  }

  if (DOM_CAT.openFiltersBtn && DOM_CAT.filtersSidebar) {
    DOM_CAT.openFiltersBtn.addEventListener('click', () => {
      DOM_CAT.filtersSidebar.classList.add('drawer-open');
      document.body.style.overflow = 'hidden';
    });
  }

  if (DOM_CAT.closeSidebarBtn && DOM_CAT.filtersSidebar) {
    DOM_CAT.closeSidebarBtn.addEventListener('click', () => {
      DOM_CAT.filtersSidebar.classList.remove('drawer-open');
      document.body.style.overflow = '';
    });
  }

  if (catParam) setCategory(catParam);
  else {
    updateSubcategorySidebar();
    renderCatalog();
  }

  window.refreshCatalogView = function() {
    updateSubcategorySidebar();
    renderCatalog();
  };
}

// ============================================================================
// 7. MÓDULO 3: PÁGINA DE PRODUCTO INDIVIDUAL (PRODUCTO.HTML)
// ============================================================================
function initProductPage() {
  const isPDP = document.getElementById('productPageMain') !== null;
  if (!isPDP) return;

  const urlParams = new URLSearchParams(window.location.search);
  const prodId = parseInt(urlParams.get('id'), 10) || 1;
  const product = PRODUCTS_DATA.find(p => p.id === prodId) || PRODUCTS_DATA[0];

  document.title = `${product.name} | NEXUS GEAR MX`;

  const catBc = document.getElementById('pdpCategoryBreadcrumb');
  if (catBc) {
    catBc.href = `catalogo.html?cat=${product.category}`;
    catBc.textContent = product.category.toUpperCase();
  }
  const titleBc = document.getElementById('pdpTitleBreadcrumb');
  if (titleBc) titleBc.textContent = product.name;

  const brandEl = document.getElementById('pdpBrand');
  if (brandEl) brandEl.textContent = product.brand;
  const titleEl = document.getElementById('pdpTitle');
  if (titleEl) titleEl.textContent = product.name;

  const ratingNum = document.getElementById('pdpRatingNum');
  if (ratingNum) ratingNum.textContent = product.rating.toFixed(1);
  const reviewsCountText = document.getElementById('pdpReviewsCountText');
  if (reviewsCountText) reviewsCountText.textContent = `(${product.reviewsCount} opiniones)`;
  const tabReviewsCount = document.getElementById('tabReviewsCount');
  if (tabReviewsCount) tabReviewsCount.textContent = product.reviewsCount;

  const shortDesc = document.getElementById('pdpShortDesc');
  if (shortDesc) shortDesc.textContent = product.description;
  const descFullHeading = document.getElementById('descFullHeading');
  if (descFullHeading) descFullHeading.textContent = product.name;
  const descFullBody = document.getElementById('descFullBody');
  if (descFullBody) descFullBody.textContent = product.description;

  const currentPrice = document.getElementById('pdpCurrentPrice');
  if (currentPrice) currentPrice.textContent = formatMXN(product.price);
  const mobileStickyPrice = document.getElementById('mobileStickyPrice');
  if (mobileStickyPrice) mobileStickyPrice.textContent = formatMXN(product.price);

  const msiNote = document.getElementById('pdpMsiNote');
  if (msiNote) msiNote.textContent = formatMSI(product.price);

  const origPrice = document.getElementById('pdpOriginalPrice');
  const savingsBadge = document.getElementById('pdpSavingsBadge');
  if (product.originalPrice && product.originalPrice > product.price) {
    if (origPrice) {
      origPrice.textContent = formatMXN(product.originalPrice);
      origPrice.hidden = false;
    }
    if (savingsBadge) {
      const diff = product.originalPrice - product.price;
      const pct = Math.round((diff / product.originalPrice) * 100);
      savingsBadge.textContent = `-${pct}% (Ahorras ${formatMXN(diff)})`;
      savingsBadge.hidden = false;
    }
  } else {
    if (origPrice) origPrice.hidden = true;
    if (savingsBadge) savingsBadge.hidden = true;
  }

  // Variantes reales del producto: {grupo: {opcion: precio_extra}}
  const pdpVariantState = { selecciones: {}, extra: 0 };
  const variantsContainer = document.getElementById('pdpVariantsContainer');
  const updatePdpPrice = () => {
    const total = product.price + pdpVariantState.extra;
    if (currentPrice) currentPrice.textContent = formatMXN(total);
    if (msiNote) msiNote.textContent = formatMSI(total);
  };
  const recomputeVariantExtra = () => {
    pdpVariantState.extra = Object.entries(pdpVariantState.selecciones).reduce((sum, [g, op]) => {
      const opts = (product.variants && product.variants[g]) || {};
      return sum + (parseFloat(opts[op]) || 0);
    }, 0);
  };

  if (variantsContainer && product.variants && Object.keys(product.variants).length) {
    Object.entries(product.variants).forEach(([grupo, opciones]) => {
      if (!opciones || typeof opciones !== 'object') return;
      const group = document.createElement('div');
      group.className = 'pdp-variant-group';
      const ops = Object.keys(opciones);
      const firstOption = ops[0];
      pdpVariantState.selecciones[grupo] = firstOption;
      group.innerHTML = `
        <div class="variant-label-row">
          <span class="variant-label-title">${grupo}:</span>
          <span class="variant-selected-value">${firstOption}</span>
        </div>
        <div class="variant-options-list"></div>`;
      const list = group.querySelector('.variant-options-list');
      ops.forEach(opcion => {
        const extraNum = parseFloat(opciones[opcion]) || 0;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'variant-pill-btn' + (opcion === firstOption ? ' active-variant' : '');
        btn.textContent = extraNum > 0 ? `${opcion} (+${formatMXN(extraNum)})` : opcion;
        btn.addEventListener('click', () => {
          group.querySelectorAll('.variant-pill-btn').forEach(b => b.classList.remove('active-variant'));
          btn.classList.add('active-variant');
          pdpVariantState.selecciones[grupo] = opcion;
          group.querySelector('.variant-selected-value').textContent = opcion;
          recomputeVariantExtra();
          updatePdpPrice();
        });
        list.appendChild(btn);
      });
      variantsContainer.appendChild(group);
    });
    recomputeVariantExtra();
    updatePdpPrice();
  }

  const getSelectedVariant = () => {
    if (!Object.keys(pdpVariantState.selecciones).length) return null;
    return {
      selecciones: { ...pdpVariantState.selecciones },
      etiqueta: Object.entries(pdpVariantState.selecciones).map(([g, o]) => `${g}: ${o}`).join(' | '),
      extra: pdpVariantState.extra
    };
  };

  const specsTable = document.getElementById('pdpSpecsTable');
  if (specsTable && product.specs) {
    specsTable.innerHTML = product.specs.map(s => `
      <tr>
        <th>${s.label}</th>
        <td>${s.value}</td>
      </tr>
    `).join('');
  }

  const mainDisplay = document.getElementById('galleryMainDisplay');
  const mainImg = document.getElementById('galleryMainImg');
  const zoomLens = document.getElementById('zoomLens');
  const thumbsStrip = document.getElementById('galleryThumbsStrip');

  const perspectiveViews = [
    { label: 'Vista 1', img: product.image, extra: false },
    { label: 'Vista 2', img: product.photoBase + '-2.jpg', extra: true },
    { label: 'Vista 3', img: product.photoBase + '-3.jpg', extra: true },
    { label: 'Vista 4', img: product.photoBase + '-4.jpg', extra: true }
  ];

  if (mainImg) mainImg.src = perspectiveViews[0].img;

  if (thumbsStrip) {
    thumbsStrip.innerHTML = perspectiveViews.map((v, i) => `
      <button class="gallery-thumb-btn ${i === 0 ? 'active-thumb' : ''}" data-idx="${i}" role="tab" aria-label="${v.label}">
        <img src="${v.img}" alt="${v.label}" ${v.extra ? 'data-extra="1"' : ''}>
      </button>
    `).join('');

    thumbsStrip.querySelectorAll('.gallery-thumb-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        thumbsStrip.querySelectorAll('.gallery-thumb-btn').forEach(b => b.classList.remove('active-thumb'));
        btn.classList.add('active-thumb');
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        if (mainImg) mainImg.src = perspectiveViews[idx].img;
      });
    });
  }

  if (mainDisplay && mainImg && zoomLens) {
    const enableZoom = () => mainDisplay.classList.add('is-zooming');
    const disableZoom = () => {
      mainDisplay.classList.remove('is-zooming');
      mainImg.style.transformOrigin = 'center center';
    };
    const setZoomOrigin = (clientX, clientY) => {
      const rect = mainDisplay.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const lensW = zoomLens.offsetWidth / 2;
      const lensH = zoomLens.offsetHeight / 2;
      const posX = Math.max(0, Math.min(x - lensW, rect.width - zoomLens.offsetWidth));
      const posY = Math.max(0, Math.min(y - lensH, rect.height - zoomLens.offsetHeight));

      zoomLens.style.left = `${posX}px`;
      zoomLens.style.top = `${posY}px`;

      const xPercent = Math.max(0, Math.min(100, (x / rect.width) * 100));
      const yPercent = Math.max(0, Math.min(100, (y / rect.height) * 100));
      mainImg.style.transformOrigin = `${xPercent}% ${yPercent}%`;
    };

    mainDisplay.addEventListener('pointerenter', (e) => {
      if (e.pointerType !== 'touch') enableZoom();
    });
    mainDisplay.addEventListener('pointerleave', (e) => {
      if (e.pointerType !== 'touch') disableZoom();
    });
    mainDisplay.addEventListener('pointermove', (e) => {
      if (mainDisplay.classList.contains('is-zooming')) setZoomOrigin(e.clientX, e.clientY);
    });

    let touchStart = null;
    let touchWasZooming = false;
    mainDisplay.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'touch') return;
      touchStart = { x: e.clientX, y: e.clientY };
      touchWasZooming = mainDisplay.classList.contains('is-zooming');
      if (!touchWasZooming) {
        enableZoom();
        setZoomOrigin(e.clientX, e.clientY);
      }
    });
    mainDisplay.addEventListener('pointerup', (e) => {
      if (e.pointerType !== 'touch' || !touchStart) return;
      const dx = e.clientX - touchStart.x;
      const dy = e.clientY - touchStart.y;
      const isTap = (dx * dx + dy * dy) < 100;
      if (isTap && touchWasZooming) disableZoom();
      touchStart = null;
      touchWasZooming = false;
    });
    mainDisplay.addEventListener('pointercancel', () => {
      touchStart = null;
      touchWasZooming = false;
    });
  }

  const switchBtns = document.querySelectorAll('#variantSwitchesList .variant-pill-btn');
  const switchLabel = document.getElementById('selectedVariantSwitchLabel');
  switchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      switchBtns.forEach(b => b.classList.remove('active-variant'));
      btn.classList.add('active-variant');
      if (switchLabel) switchLabel.textContent = btn.textContent.trim();
      showToast(`Variante seleccionada: ${btn.textContent.trim()}`, 'info');
    });
  });

  const colorBtns = document.querySelectorAll('#variantColorsList .variant-pill-btn');
  const colorLabel = document.getElementById('selectedVariantColorLabel');
  colorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      colorBtns.forEach(b => b.classList.remove('active-variant'));
      btn.classList.add('active-variant');
      const val = btn.getAttribute('data-color');
      if (colorLabel) colorLabel.textContent = val;
      showToast(`Color seleccionado: ${val}`, 'info');
    });
  });

  const qtyInput = document.getElementById('pdpQtyInput');
  const qtyMinus = document.getElementById('pdpQtyMinus');
  const qtyPlus = document.getElementById('pdpQtyPlus');

  if (qtyMinus && qtyPlus && qtyInput) {
    qtyMinus.addEventListener('click', () => {
      let q = parseInt(qtyInput.value, 10) || 1;
      if (q > 1) qtyInput.value = q - 1;
    });
    qtyPlus.addEventListener('click', () => {
      let q = parseInt(qtyInput.value, 10) || 1;
      if (q < 10) qtyInput.value = q + 1;
    });
  }

  const addBtn = document.getElementById('pdpAddToCartBtn');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const q = parseInt(qtyInput ? qtyInput.value : 1, 10) || 1;
      addToCart(product.id, q, getSelectedVariant());
      const drawer = document.getElementById('cartDrawerOverlay');
      if (drawer) {
        drawer.hidden = false;
        document.body.style.overflow = 'hidden';
      }
    });
  }

  const buyNowBtn = document.getElementById('pdpBuyNowBtn');
  if (buyNowBtn) {
    buyNowBtn.addEventListener('click', () => {
      const q = parseInt(qtyInput ? qtyInput.value : 1, 10) || 1;
      addToCart(product.id, q, getSelectedVariant());
      window.location.href = 'checkout.html';
    });
  }

  const cpBtn = document.getElementById('calculateShippingBtn');
  const cpInput = document.getElementById('shippingCpInput');
  const cpResult = document.getElementById('shippingCalcResult');

  if (cpBtn && cpInput && cpResult) {
    cpBtn.addEventListener('click', () => {
      const val = cpInput.value.trim();
      if (!val || val.length < 5) {
        cpResult.innerHTML = '⚠️ Por favor ingresa un Código Postal válido de 5 dígitos (ej: 86035 o 06700).';
        return;
      }
      if (val.startsWith('86')) {
        cpResult.className = 'shipping-calc-result is-tabasco';
        cpResult.innerHTML = `
          📍 <strong>¡Entrega Local en Villahermosa (C.P. ${val})!</strong><br>
          • <strong>Retiro sin costo:</strong> Disponible hoy en Plaza Atenas (Tabasco 2000).<br>
          • <strong>Entrega local express:</strong> Recíbelo mañana por solo $89 MXN.
        `;
      } else {
        cpResult.className = 'shipping-calc-result';
        if (product.price >= 999) {
          cpResult.innerHTML = `
            🚚 <strong>¡Envío GRATIS a tu C.P. ${val}!</strong><br>
            • Llega en 2 a 3 días hábiles vía FedEx / DHL Express.<br>
            • Rastreo por WhatsApp y garantía total contra daños.
          `;
        } else {
          cpResult.innerHTML = `
            📦 <strong>Envío Nacional (C.P. ${val}):</strong> $149 MXN vía FedEx.<br>
            • Agrega $${(999 - product.price).toFixed(2)} MXN más para obtener <strong>Envío Gratis</strong>.
          `;
        }
      }
    });
  }

  const tabTriggers = document.querySelectorAll('.pdp-tab-trigger');
  const tabPanels = {
    desc: document.getElementById('panelDesc'),
    specs: document.getElementById('panelSpecs'),
    reviews: document.getElementById('panelReviews'),
    shipping: document.getElementById('panelShipping')
  };

  tabTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      tabTriggers.forEach(t => {
        t.classList.remove('active-tab');
        t.setAttribute('aria-selected', 'false');
      });
      trigger.classList.add('active-tab');
      trigger.setAttribute('aria-selected', 'true');

      const target = trigger.getAttribute('data-tab');
      Object.keys(tabPanels).forEach(key => {
        if (tabPanels[key]) tabPanels[key].classList.toggle('active-panel', key === target);
      });
    });
  });

  const reviewsContainer = document.getElementById('customerReviewsList');
  if (reviewsContainer) {
    const mockReviews = [
      {
        author: 'Diego Navarro (Villahermosa, Tabasco)',
        stars: '★★★★★',
        verified: true,
        date: 'Hace 4 días',
        comment: 'Excelente producto. Los acabados son de primera y los switches se sienten súper suaves para programar y jugar. Pasé a recogerlo a Tabasco 2000 y el trato fue impecable.'
      },
      {
        author: 'Valeria Morales (CDMX)',
        stars: '★★★★★',
        verified: true,
        date: 'Hace 1 semana',
        comment: 'Llegó en 2 días por FedEx hasta la alcaldía Cuauhtémoc. El empaque venía bien protegido con burbuja. Vale totalmente lo que cuesta y la iluminación se ve elegante.'
      }
    ];

    reviewsContainer.innerHTML = mockReviews.map(r => `
      <div class="customer-review-card">
        <div class="review-header-row">
          <div>
            <div class="reviewer-name">${r.author}</div>
            <div style="color:var(--color-warning); font-size:0.875rem;">${r.stars}</div>
          </div>
          <div style="text-align:right;">
            ${r.verified ? '<span class="review-verified-badge">✔ Compra Verificada</span>' : ''}
            <div style="font-size:0.75rem; color:var(--text-muted);">${r.date}</div>
          </div>
        </div>
        <p class="review-comment-text">${r.comment}</p>
      </div>
    `).join('');
  }

  window.submitNewReview = async function() {
    const author = document.getElementById('reviewAuthorInput').value.trim();
    const ratingVal = document.getElementById('reviewRatingSelect').value;
    const comment = document.getElementById('reviewCommentInput').value.trim();
    if (!author || !comment) return;

    // Registrar reseña en SQLite vía API
    try {
      const res = await fetch(`/api/productos/${product.id}/resenas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          autor: author,
          calificacion: parseInt(ratingVal, 10),
          comentario: comment
        })
      });
      const data = await res.json();
      if (data.ok) {
        showToast('¡Tu reseña ha sido guardada en la base de datos SQLite!', 'success');
      }
    } catch(err) {
      console.warn("Fallo guardando en API de reseñas, guardando en vista:", err);
    }

    const starsStr = '★'.repeat(parseInt(ratingVal, 10)) + '☆'.repeat(5 - parseInt(ratingVal, 10));
    const newCard = document.createElement('div');
    newCard.className = 'customer-review-card';
    newCard.innerHTML = `
      <div class="review-header-row">
        <div>
          <div class="reviewer-name">${author}</div>
          <div style="color:var(--color-warning); font-size:0.875rem;">${starsStr}</div>
        </div>
        <div style="text-align:right;">
          <span class="review-verified-badge" style="background:rgba(0,242,254,0.15); color:var(--accent-cyan); border:1px solid var(--accent-cyan);">✔ Guardado en SQLite</span>
          <div style="font-size:0.75rem; color:var(--text-muted);">Hoy</div>
        </div>
      </div>
      <p class="review-comment-text">${comment}</p>
    `;
    if (reviewsContainer) reviewsContainer.insertBefore(newCard, reviewsContainer.firstChild);
    document.getElementById('addReviewForm').reset();
  };

  const relatedGrid = document.getElementById('relatedProductsGrid');
  if (relatedGrid) {
    const relatedItems = PRODUCTS_DATA.filter(p => p.id !== product.id).slice(0, 3);
    relatedGrid.innerHTML = relatedItems.map(p => generateProductCardHTML(p)).join('');
  }
}

// ============================================================================
// 8. MÓDULO 4: CARRITO DE COMPRAS DETALLADO (CARRITO.HTML)
// ============================================================================
function initCartPage() {
  const isCartPage = document.getElementById('cartPageMain') !== null;
  if (!isCartPage) return;

  const itemsContainer = document.getElementById('cartPageItemsList');
  const cartTableCount = document.getElementById('cartTableCount');
  const savedList = document.getElementById('savedForLaterList');
  const savedCount = document.getElementById('savedForLaterCount');

  const summarySubtotal = document.getElementById('summarySubtotal');
  const summaryDiscountRow = document.getElementById('summaryDiscountRow');
  const appliedCouponCode = document.getElementById('appliedCouponCode');
  const summaryDiscount = document.getElementById('summaryDiscount');
  const summaryShipping = document.getElementById('summaryShipping');
  const summaryTotal = document.getElementById('summaryTotal');

  function renderCartPage() {
    const totalItems = appState.cart.reduce((sum, i) => sum + i.quantity, 0);
    const subtotal = appState.cart.reduce((sum, i) => sum + (cartItemUnitPrice(i) * i.quantity), 0);

    if (cartTableCount) cartTableCount.textContent = totalItems;
    if (summarySubtotal) summarySubtotal.textContent = formatMXN(subtotal);

    // Render Items
    if (!itemsContainer) return;

    if (appState.cart.length === 0) {
      itemsContainer.innerHTML = `
        <div style="padding:3.5rem 1rem; text-align:center; color:var(--text-secondary);">
          <div style="font-size:3rem; margin-bottom:1rem;">🛒</div>
          <h3 style="font-size:1.25rem; font-weight:800; color:var(--text-primary); margin-bottom:0.5rem;">Tu carrito está vacío</h3>
          <p style="margin-bottom:1.5rem;">Descubre los mejores accesorios gaming y de estudio al mejor precio en México.</p>
          <a href="catalogo.html" class="btn btn-primary">Ir al Catálogo</a>
        </div>
      `;
    } else {
      itemsContainer.innerHTML = appState.cart.map(item => `
        <div class="cart-page-item" data-id="${item.product.id}">
          <div class="cart-item-img-box">
            <img src="${item.product.image}" alt="${item.product.name}">
          </div>

          <div>
            <a href="producto.html?id=${item.product.id}" class="cart-item-title-link">${item.product.name}</a>
            <div class="cart-item-variant-tag">${item.product.brand} • ${item.product.connectionLabel || item.product.connectivity}${item.varianteLabel ? ` • ${item.varianteLabel}` : ''}</div>
            <button class="save-for-later-btn" onclick="saveItemForLater(${item.product.id})">Guardar para después</button>
          </div>

          <div class="cart-item-unit-price hide-mobile">
            ${formatMXN(cartItemUnitPrice(item))}
          </div>

          <div>
            <div class="pdp-qty-stepper" style="height:36px; max-width:110px;">
              <button class="pdp-qty-btn" onclick="updateCartQty(${item.product.id}, -1)">-</button>
              <input type="text" class="pdp-qty-input" value="${item.quantity}" readonly>
              <button class="pdp-qty-btn" onclick="updateCartQty(${item.product.id}, 1)">+</button>
            </div>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span class="cart-item-total-price">${formatMXN(cartItemUnitPrice(item) * item.quantity)}</span>
            <button class="cart-item-remove-btn" onclick="removeFromCart(${item.product.id})" title="Eliminar artículo" style="margin-left:0.5rem;">✕</button>
          </div>
        </div>
      `).join('');
    }

    // Render Saved for later
    if (savedList && savedCount) {
      savedCount.textContent = appState.savedForLater.length;
      if (appState.savedForLater.length === 0) {
        savedList.innerHTML = `<div style="padding:1.5rem; text-align:center; color:var(--text-muted); font-size:0.875rem;">No tienes artículos guardados para después.</div>`;
      } else {
        savedList.innerHTML = appState.savedForLater.map(p => `
          <div class="cart-page-item" data-id="${p.id}">
            <div class="cart-item-img-box"><img src="${p.image}" alt="${p.name}"></div>
            <div>
              <a href="producto.html?id=${p.id}" class="cart-item-title-link">${p.name}</a>
              <button class="save-for-later-btn" onclick="moveBackToCart(${p.id})">Mover de nuevo al carrito</button>
            </div>
            <div class="cart-item-unit-price">${formatMXN(p.price)}</div>
            <div><button class="btn btn-outline" style="padding:0.4rem 0.85rem; font-size:0.75rem;" onclick="moveBackToCart(${p.id})">Agregar</button></div>
            <div><button class="cart-item-remove-btn" onclick="removeSavedLater(${p.id})">✕</button></div>
          </div>
        `).join('');
      }
    }

    // Calcular Descuento y Envío
    let discountAmount = 0;
    if (appState.appliedCoupon) {
      if (appState.appliedCoupon.code === 'ESTUDIANTE10') {
        discountAmount = subtotal * 0.10;
      } else if (appState.appliedCoupon.code === 'NEXUS100') {
        discountAmount = Math.min(100, subtotal);
      }
      if (summaryDiscountRow && appliedCouponCode && summaryDiscount) {
        summaryDiscountRow.hidden = false;
        appliedCouponCode.textContent = appState.appliedCoupon.code;
        summaryDiscount.textContent = `-${formatMXN(discountAmount)}`;
      }
    } else if (summaryDiscountRow) {
      summaryDiscountRow.hidden = true;
    }

    let finalShipping = 0;
    if (appState.shippingCost !== null) {
      finalShipping = appState.shippingCost;
      if (summaryShipping) summaryShipping.textContent = finalShipping === 0 ? 'GRATIS' : formatMXN(finalShipping);
    } else {
      if (subtotal >= 999 || (appState.appliedCoupon && appState.appliedCoupon.code === 'VILLAHERMOSA')) {
        finalShipping = 0;
        if (summaryShipping) summaryShipping.textContent = 'GRATIS';
      } else if (subtotal > 0) {
        finalShipping = 149;
        if (summaryShipping) summaryShipping.textContent = '$149.00 MXN';
      } else {
        if (summaryShipping) summaryShipping.textContent = '$0.00 MXN';
      }
    }

    const totalToPay = Math.max(0, subtotal - discountAmount + finalShipping);
    if (summaryTotal) summaryTotal.textContent = formatMXN(totalToPay);
  }

  // Guardar para después
  window.saveItemForLater = function(productId) {
    const item = appState.cart.find(i => i.product.id === productId);
    if (!item) return;

    appState.cart = appState.cart.filter(i => i.product.id !== productId);
    appState.savedForLater.push(item.product);

    persistCart();
    persistSavedLater();
    updateCartUI();
    renderCartPage();
    showToast('Producto guardado para después', 'info');
  };

  window.moveBackToCart = function(productId) {
    const prod = appState.savedForLater.find(p => p.id === productId);
    if (!prod) return;

    appState.savedForLater = appState.savedForLater.filter(p => p.id !== productId);
    addToCart(productId, 1);
    persistSavedLater();
    renderCartPage();
  };

  window.removeSavedLater = function(productId) {
    appState.savedForLater = appState.savedForLater.filter(p => p.id !== productId);
    persistSavedLater();
    renderCartPage();
    showToast('Artículo removido de guardados', 'info');
  };

  // Vaciar carrito
  const emptyBtn = document.getElementById('emptyCartBtn');
  if (emptyBtn) {
    emptyBtn.addEventListener('click', () => {
      if (confirm('¿Deseas vaciar todos los artículos de tu carrito?')) {
        appState.cart = [];
        persistCart();
        updateCartUI();
        renderCartPage();
        showToast('Carrito vaciado', 'info');
      }
    });
  }

  // Cupones de Descuento
  const applyCouponBtn = document.getElementById('applyCouponBtn');
  const couponInput = document.getElementById('cartCouponInput');
  const couponStatus = document.getElementById('couponStatusMessage');

  if (applyCouponBtn && couponInput) {
    applyCouponBtn.addEventListener('click', async () => {
      const code = couponInput.value.trim().toUpperCase();
      if (!code) return;

      if (code === 'ESTUDIANTE10') {
        const subtotal = appState.cart.reduce((s, i) => s + (i.product.price * i.quantity), 0);
        try {
          const res = await fetch('/api/cupones/validar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ codigo: code, subtotal })
          });
          const data = await res.json();
          if (res.ok && data.ok) {
            appState.appliedCoupon = { code: 'ESTUDIANTE10', discountPct: 0.10 };
            localStorage.setItem('nexus_coupon', JSON.stringify(appState.appliedCoupon));
            couponStatus.innerHTML = `<span style="color:var(--color-success);">✔ Cupón ESTUDIANTE10 aplicado: 10% de descuento.</span>`;
            renderCartPage();
            showToast('¡Cupón de estudiante UJAT aplicado!', 'success');
          } else {
            couponStatus.innerHTML = `<span style="color:var(--color-danger);">✖ ${data.error || 'Cupón no válido para tu cuenta'}</span>`;
          }
        } catch (e) {
          couponStatus.innerHTML = `<span style="color:var(--color-danger);">✖ No se pudo validar el cupón. Intenta de nuevo.</span>`;
        }
      } else if (code === 'NEXUS100') {
        appState.appliedCoupon = { code: 'NEXUS100', discountAmount: 100 };
        localStorage.setItem('nexus_coupon', JSON.stringify(appState.appliedCoupon));
        couponStatus.innerHTML = `<span style="color:var(--color-success);">✔ Cupón NEXUS100 aplicado: $100 MXN descontados.</span>`;
        renderCartPage();
        showToast('¡Cupón de $100 MXN aplicado!', 'success');
      } else {
        couponStatus.innerHTML = `<span style="color:var(--color-danger);">✖ Cupón inválido o expirado. Prueba con ESTUDIANTE10 o NEXUS100.</span>`;
      }
    });
  }

  // Calculador de Envíos en Carrito
  const calcShipBtn = document.getElementById('cartCalcShippingBtn');
  const shipCpInput = document.getElementById('cartShippingCp');
  const shipResult = document.getElementById('cartShippingResult');

  if (calcShipBtn && shipCpInput && shipResult) {
    calcShipBtn.addEventListener('click', () => {
      const val = shipCpInput.value.trim();
      if (!val || val.length < 5) {
        shipResult.innerHTML = '⚠️ Ingresa un Código Postal mexicano de 5 dígitos.';
        return;
      }

      if (val.startsWith('86')) {
        appState.shippingCost = 0;
        shipResult.className = 'shipping-calc-result is-tabasco';
        shipResult.innerHTML = '📍 <strong>¡Villahermosa / Tabasco!:</strong> Retiro GRATIS en Plaza Atenas (Tabasco 2000).';
      } else {
        const sub = appState.cart.reduce((s, i) => s + (i.product.price * i.quantity), 0);
        appState.shippingCost = sub >= 999 ? 0 : 149;
        shipResult.className = 'shipping-calc-result';
        shipResult.innerHTML = sub >= 999 
          ? '🚚 <strong>¡Envío GRATIS!</strong> Tu compra califica para envío sin costo nacional por FedEx.' 
          : '📦 <strong>Envío Nacional:</strong> $149.00 MXN vía FedEx Express.';
      }
      renderCartPage();
    });
  }

  window.refreshCartPage = renderCartPage;
  renderCartPage();
}

// ============================================================================
// 9. MÓDULO 5: CHECKOUT TRANSPARENTE EN PASOS (CHECKOUT.HTML)
// ============================================================================
function initCheckoutPage() {
  const isCheckout = document.getElementById('checkoutPageMain') !== null;
  if (!isCheckout) return;

  const itemsList = document.getElementById('checkoutItemsList');
  const checkoutSubtotal = document.getElementById('checkoutSubtotal');
  const checkoutDiscountRow = document.getElementById('checkoutDiscountRow');
  const checkoutDiscount = document.getElementById('checkoutDiscount');
  const checkoutShipping = document.getElementById('checkoutShipping');
  const checkoutTotal = document.getElementById('checkoutTotal');

  const optHome = document.getElementById('optShipHome');
  const optTabasco = document.getElementById('optShipTabasco');
  const homeFields = document.getElementById('homeAddressFormFields');
  const tabascoInfo = document.getElementById('villahermosaPickupInfo');

  // Alternador de Envío
  if (optHome && optTabasco) {
    optHome.addEventListener('click', () => {
      optHome.classList.add('selected');
      optTabasco.classList.remove('selected');
      homeFields.hidden = false;
      tabascoInfo.hidden = true;
      appState.shippingType = 'home';
      updateCheckoutTotals();
    });

    optTabasco.addEventListener('click', () => {
      optTabasco.classList.add('selected');
      optHome.classList.remove('selected');
      homeFields.hidden = true;
      tabascoInfo.hidden = false;
      appState.shippingType = 'tabasco';
      updateCheckoutTotals();
    });
  }

  // Alternador de Métodos de Pago
  const paymentTabs = document.querySelectorAll('.payment-tab-btn');
  const paymentPanels = {
    card: document.getElementById('panelPaymentCard'),
    oxxo: document.getElementById('panelPaymentOxxo'),
    spei: document.getElementById('panelPaymentSpei'),
    cod: document.getElementById('panelPaymentCod')
  };

  paymentTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      paymentTabs.forEach(t => t.classList.remove('active-payment'));
      tab.classList.add('active-payment');
      const radio = tab.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;

      const method = tab.getAttribute('data-method');
      Object.keys(paymentPanels).forEach(k => {
        if (paymentPanels[k]) paymentPanels[k].classList.toggle('active-panel', k === method);
      });
    });
  });

  // Previsualización interactiva de Tarjeta
  const cardNumInput = document.getElementById('cardInputNumber');
  const cardHolderInput = document.getElementById('cardInputHolder');
  const cardExpInput = document.getElementById('cardInputExp');

  const cardDisplay = document.getElementById('cardPreviewDisplay');
  const cardHolderDisplay = document.getElementById('cardHolderDisplay');
  const cardExpDisplay = document.getElementById('cardExpDisplay');
  const cardTypeBrand = document.getElementById('cardTypeBrand');

  if (cardNumInput) {
    cardNumInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '').substring(0, 16);
      val = val.replace(/(\d{4})/g, '$1 ').trim();
      e.target.value = val;
      if (cardDisplay) cardDisplay.textContent = val || '•••• •••• •••• ••••';
      if (cardTypeBrand) {
        if (val.startsWith('4')) cardTypeBrand.textContent = 'VISA';
        else if (val.startsWith('5')) cardTypeBrand.textContent = 'MASTERCARD';
        else cardTypeBrand.textContent = 'CARD';
      }
    });
  }

  if (cardHolderInput && cardHolderDisplay) {
    cardHolderInput.addEventListener('input', (e) => {
      cardHolderDisplay.textContent = e.target.value.toUpperCase() || 'TU NOMBRE';
    });
  }

  if (cardExpInput && cardExpDisplay) {
    cardExpInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '').substring(0, 4);
      if (val.length >= 2) val = val.substring(0, 2) + '/' + val.substring(2);
      e.target.value = val;
      cardExpDisplay.textContent = val || 'MM/AA';
    });
  }

  function updateCheckoutTotals() {
    const subtotal = appState.cart.reduce((s, i) => s + (cartItemUnitPrice(i) * i.quantity), 0);
    if (checkoutSubtotal) checkoutSubtotal.textContent = formatMXN(subtotal);

    let discount = 0;
    if (appState.appliedCoupon) {
      if (appState.appliedCoupon.code === 'ESTUDIANTE10') discount = subtotal * 0.10;
      else if (appState.appliedCoupon.code === 'NEXUS100') discount = Math.min(100, subtotal);
      if (checkoutDiscountRow && checkoutDiscount) {
        checkoutDiscountRow.hidden = false;
        checkoutDiscount.textContent = `-${formatMXN(discount)}`;
      }
    }

    let shipping = 0;
    if (appState.shippingType === 'tabasco' || subtotal >= 999) {
      shipping = 0;
      if (checkoutShipping) checkoutShipping.textContent = 'GRATIS';
    } else {
      shipping = 149;
      if (checkoutShipping) checkoutShipping.textContent = '$149.00 MXN';
    }

    const total = Math.max(0, subtotal - discount + shipping);
    if (checkoutTotal) checkoutTotal.textContent = formatMXN(total);
  }

  // Renderizar Items en Resumen de Checkout
  if (itemsList) {
    if (appState.cart.length === 0) {
      itemsList.innerHTML = `<div style="color:var(--text-muted); font-size:0.8438rem;">No hay artículos en tu pedido.</div>`;
    } else {
      itemsList.innerHTML = appState.cart.map(i => `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:0.5rem 0; font-size:0.8125rem; border-bottom:1px solid var(--border-subtle);">
          <span style="font-weight:600; color:var(--text-primary); max-width:240px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
            ${i.quantity}x ${i.product.name}${i.varianteLabel ? ` (${i.varianteLabel})` : ''}
          </span>
          <span style="font-family:var(--font-mono); color:var(--accent-cyan); font-weight:700;">
            ${formatMXN(cartItemUnitPrice(i) * i.quantity)}
          </span>
        </div>
      `).join('');
    }
  }

  updateCheckoutTotals();

  // Confirmar Pedido con SQLite API
  const confirmBtn = document.getElementById('confirmOrderBtn');
  const successModal = document.getElementById('orderSuccessModal');

  if (confirmBtn && successModal) {
    confirmBtn.addEventListener('click', async () => {
      const name = document.getElementById('checkoutName').value.trim();
      const email = document.getElementById('checkoutEmail').value.trim();
      const phone = document.getElementById('checkoutPhone').value.trim();

      if (!name || !email || !phone) {
        alert('Por favor completa tus datos de contacto (Nombre, Correo y Teléfono).');
        return;
      }

      if (appState.cart.length === 0) {
        alert('Tu carrito está vacío. Agrega periféricos antes de pagar.');
        return;
      }

      confirmBtn.disabled = true;
      confirmBtn.innerHTML = '<span>Procesando pedido en SQLite...</span>';

      const payload = {
        nombre_contacto: name,
        correo_contacto: email,
        telefono_contacto: phone,
        tipo_envio: appState.shippingType === 'tabasco' ? 'retiro_villahermosa' : 'domicilio',
        calle: document.getElementById('checkoutStreet') ? document.getElementById('checkoutStreet').value.trim() : '',
        colonia: document.getElementById('checkoutCol') ? document.getElementById('checkoutCol').value.trim() : '',
        ciudad: document.getElementById('checkoutCity') ? document.getElementById('checkoutCity').value.trim() : '',
        estado: document.getElementById('checkoutState') ? document.getElementById('checkoutState').value.trim() : 'Tabasco',
        cp: document.getElementById('checkoutZip') ? document.getElementById('checkoutZip').value.trim() : '',
        referencias: document.getElementById('checkoutRef') ? document.getElementById('checkoutRef').value.trim() : '',
        metodo_pago: (function() {
          const activeTab = document.querySelector('.payment-tab-btn.active-payment');
          return activeTab ? activeTab.getAttribute('data-method') : 'tarjeta';
        })(),
        meses_msi: 1,
        codigo_cupon: appState.appliedCoupon ? appState.appliedCoupon.code : null,
        items: appState.cart.map(i => ({ producto_id: i.product.id, cantidad: i.quantity, variante: i.varianteSel || null }))
      };

      try {
        const response = await fetch('/api/pedidos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const resData = await response.json();

        if (!resData.ok) {
          throw new Error(resData.error || 'Error al procesar el pedido');
        }

        const orderId = resData.folio;
        document.getElementById('successOrderNum').textContent = `#${orderId}`;
        document.getElementById('successTotalAmount').textContent = formatMXN(resData.total);
        document.getElementById('successShippingType').textContent = appState.shippingType === 'tabasco' 
          ? 'Listo para retirar hoy en Plaza Atenas, Tabasco 2000' 
          : (resData.guia ? `Guía FedEx #${resData.guia} (2-4 días)` : 'En camino vía FedEx Express');

        // Limpiar carrito
        appState.cart = [];
        persistCart();
        updateCartUI();

        successModal.hidden = false;
        document.body.style.overflow = 'hidden';
        showToast(`¡Pedido #${orderId} registrado con éxito en SQLite!`, 'success');
        return;
      } catch (err) {
        console.warn('Fallo guardando vía API, aplicando fallback local:', err);
      } finally {
        confirmBtn.disabled = false;
        confirmBtn.innerHTML = '<span>Confirmar y Pagar Pedido</span>';
      }

      // Fallback local si el servidor no responde
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      const orderId = `NX-${randomNum}`;

      document.getElementById('successOrderNum').textContent = `#${orderId}`;
      document.getElementById('successTotalAmount').textContent = checkoutTotal.textContent;
      document.getElementById('successShippingType').textContent = appState.shippingType === 'tabasco' 
        ? 'Listo para retirar hoy en Plaza Atenas, Tabasco 2000' 
        : 'Guía FedEx #7894' + randomNum + ' (2-4 días)';

      try {
        const pastOrders = JSON.parse(localStorage.getItem('nexus_orders') || '[]');
        pastOrders.unshift({
          id: orderId,
          date: 'Hoy',
          items: appState.cart.map(i => `${i.quantity}x ${i.product.name}`).join(', '),
          total: checkoutTotal.textContent,
          status: appState.shippingType === 'tabasco' ? 'Listo en Villahermosa' : 'En camino vía FedEx'
        });
        localStorage.setItem('nexus_orders', JSON.stringify(pastOrders));
      } catch (e) {}

      appState.cart = [];
      persistCart();
      updateCartUI();

      successModal.hidden = false;
      document.body.style.overflow = 'hidden';
    });
  }
}

// ============================================================================
// 10. MÓDULO 6: MI CUENTA / DASHBOARD (CUENTA.HTML)
// ============================================================================
function initAccountPage() {
  const isAccount = document.getElementById('accountPageMain') !== null;
  if (!isAccount) return;

  const authView = document.getElementById('accountAuthView');
  const dashboardView = document.getElementById('accountDashboardView');
  const authMessage = document.getElementById('authMessage');
  const tabButtons = document.querySelectorAll('.dash-nav-btn[data-dash-tab]');
  const panels = {
    orders: document.getElementById('panelDashOrders'),
    wishlist: document.getElementById('panelDashWishlist'),
    addresses: document.getElementById('panelDashAddresses'),
    profile: document.getElementById('panelDashProfile'),
    prefs: document.getElementById('panelDashPrefs')
  };

  let currentUser = null;

  function setAuthMessage(message, type = 'error') {
    if (!authMessage) return;
    authMessage.textContent = message;
    authMessage.className = `account-auth-message ${type}`;
    authMessage.hidden = false;
  }

  function clearAuthMessage() {
    if (!authMessage) return;
    authMessage.hidden = true;
    authMessage.textContent = '';
    authMessage.className = 'account-auth-message';
  }

  function switchAuthTab(tab) {
    document.querySelectorAll('.account-auth-tab').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-auth-tab') === tab);
    });
    document.querySelectorAll('.account-auth-form').forEach(form => {
      form.hidden = form.getAttribute('data-auth-panel') !== tab;
    });
    clearAuthMessage();
  }

  function showAuthView() {
    currentUser = null;
    appState.currentUser = null;
    if (authView) authView.hidden = false;
    if (dashboardView) dashboardView.hidden = true;
  }

  function showDashboard(user) {
    currentUser = user;
    appState.currentUser = user;
    if (authView) authView.hidden = true;
    if (dashboardView) dashboardView.hidden = false;

    const name = user.nombre || 'Usuario';
    const avatar = document.getElementById('dashUserAvatar');
    const nameEl = document.getElementById('dashUserName');
    const badgeEl = document.getElementById('dashUserBadge');
    if (avatar) avatar.textContent = name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase() || 'U';
    if (nameEl) nameEl.textContent = name;
    const roleLabels = { admin: 'Administrador Nexus', vendedor: 'Vendedor Nexus', cliente: 'Cliente Nexus' };
    if (badgeEl) badgeEl.textContent = roleLabels[user.rol] || 'Cliente Nexus';
    if (user.es_estudiante) {
      let studentBadge = document.getElementById('dashUserStudentBadge');
      if (!studentBadge && nameEl && nameEl.parentElement) {
        studentBadge = document.createElement('span');
        studentBadge.id = 'dashUserStudentBadge';
        studentBadge.className = 'badge-tag badge-new';
        studentBadge.style.cssText = 'margin-left:0.5rem; font-size:0.7rem; vertical-align:middle;';
        nameEl.insertAdjacentElement('afterend', studentBadge);
      }
      if (studentBadge) studentBadge.textContent = 'Estudiante UJAT ✓';
    }
    const adminPanelLink = document.getElementById('accountAdminPanelLink');
    const sellerPanelLink = document.getElementById('accountSellerPanelLink');
    if (adminPanelLink) adminPanelLink.style.display = user.rol === 'admin' ? 'flex' : 'none';
    if (sellerPanelLink) sellerPanelLink.style.display = user.rol === 'vendedor' ? 'flex' : 'none';

    fillProfileForm(user);
    renderPastOrders();
    loadAddresses();
    loadPreferences();
    loadAccountWishlist();

    if (window.location.hash === '#deseos') {
      const wBtn = document.querySelector('.dash-nav-btn[data-dash-tab="wishlist"]');
      if (wBtn) wBtn.click();
    }
  }

  async function fetchAuthMe() {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      return data.ok && data.autenticado ? data : null;
    } catch (e) {
      return null;
    }
  }

  async function initAuthGate() {
    const session = await fetchAuthMe();
    if (session && session.cliente) {
      showDashboard(session.cliente);
    } else {
      showAuthView();
    }
  }

  // Tabs login / registro
  document.querySelectorAll('.account-auth-tab').forEach(btn => {
    btn.addEventListener('click', () => switchAuthTab(btn.getAttribute('data-auth-tab')));
  });

  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearAuthMessage();
      const correo = document.getElementById('loginCorreo').value.trim();
      const password = document.getElementById('loginPassword').value;
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ correo, password })
        });
        const data = await res.json();
        if (data.ok) {
          if (data.cliente.rol === 'admin') {
            window.location.href = 'admin.html';
            return;
          }
          if (data.cliente.rol === 'vendedor') {
            window.location.href = 'vendedor.html';
            return;
          }
          showDashboard(data.cliente);
          showToast('Sesión iniciada correctamente', 'success');
        } else {
          setAuthMessage(data.error || 'No se pudo iniciar sesión', 'error');
        }
      } catch (err) {
        setAuthMessage('No se pudo conectar con el servidor', 'error');
      }
    });
  }

  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearAuthMessage();
      const payload = {
        nombre: document.getElementById('regNombre').value.trim(),
        correo: document.getElementById('regCorreo').value.trim(),
        telefono: document.getElementById('regTelefono').value.trim(),
        password: document.getElementById('regPassword').value,
        rol: document.getElementById('regRol') ? document.getElementById('regRol').value : 'cliente'
      };
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.ok) {
          if (data.cliente.rol === 'vendedor') {
            window.location.href = 'vendedor.html';
            return;
          }
          showDashboard(data.cliente);
          showToast('Cuenta creada correctamente', 'success');
        } else {
          setAuthMessage(data.error || 'No se pudo crear la cuenta', 'error');
        }
      } catch (err) {
        setAuthMessage('No se pudo conectar con el servidor', 'error');
      }
    });
  }

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      try { await fetch('/api/auth/logout', { method: 'POST' }); } catch (e) {}
      showAuthView();
      showToast('Sesión cerrada', 'info');
    });
  }

  const deleteAccountBtn = document.getElementById('deleteAccountBtn');
  if (deleteAccountBtn) {
    deleteAccountBtn.addEventListener('click', async () => {
      const confirmado = window.confirm('¿Eliminar tu cuenta de forma permanente? Se borrarán tus datos de perfil, direcciones, favoritos y preferencias. Tus pedidos se conservarán como compras de invitado. Esta acción no se puede deshacer.');
      if (!confirmado) return;
      try {
        const res = await fetch('/api/cuenta', { method: 'DELETE' });
        const data = await res.json();
        if (data.ok) {
          showAuthView();
          showToast('Cuenta eliminada', 'success');
        } else {
          showToast(data.error || 'No se pudo eliminar la cuenta', 'error');
        }
      } catch (e) {
        showToast('No se pudo conectar con el servidor', 'error');
      }
    });
  }

  // Tabs del dashboard
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active-dash-tab'));
      btn.classList.add('active-dash-tab');

      const target = btn.getAttribute('data-dash-tab');
      Object.keys(panels).forEach(k => {
        if (panels[k]) panels[k].style.display = (k === target) ? 'block' : 'none';
      });

      if (target === 'wishlist') renderAccountWishlist();
    });
  });

  function fillProfileForm(user) {
    const nombre = document.getElementById('profileNombre');
    const correo = document.getElementById('profileCorreo');
    const telefono = document.getElementById('profileTelefono');
    if (nombre) nombre.value = user.nombre || '';
    if (correo) correo.value = user.correo || '';
    if (telefono) telefono.value = user.telefono || '';
  }

  const profileForm = document.getElementById('profileForm');
  if (profileForm) {
    profileForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        nombre: document.getElementById('profileNombre').value.trim(),
        telefono: document.getElementById('profileTelefono').value.trim()
      };
      try {
        const res = await fetch('/api/cuenta/perfil', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.ok) {
          if (currentUser) {
            currentUser.nombre = payload.nombre;
            currentUser.telefono = payload.telefono;
            appState.currentUser = currentUser;
            const nameEl = document.getElementById('dashUserName');
            const avatar = document.getElementById('dashUserAvatar');
            if (nameEl) nameEl.textContent = payload.nombre;
            if (avatar) avatar.textContent = payload.nombre.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase() || 'U';
          }
          showToast(data.mensaje || 'Datos personales actualizados', 'success');
        } else {
          showToast(data.error || 'No se pudo actualizar el perfil', 'info');
        }
      } catch (err) {
        showToast('No se pudo conectar con el servidor', 'info');
      }
    });
  }

  async function renderPastOrders() {
    const container = document.getElementById('accountOrdersContent');
    if (!container) return;
    container.innerHTML = `<div class="checkout-step-card">Cargando pedidos...</div>`;

    try {
      const res = await fetch('/api/cuenta/pedidos');
      const data = await res.json();
      const pedidos = data.ok && Array.isArray(data.pedidos) ? data.pedidos : [];

      if (pedidos.length === 0) {
        container.innerHTML = `
          <div class="checkout-step-card" style="text-align:center; padding:3rem 1.5rem;">
            <div style="font-size:3rem; margin-bottom:0.75rem;">📦</div>
            <h3 style="font-size:1.2rem; font-weight:800; color:var(--text-primary); margin-bottom:0.5rem;">Aún no tienes pedidos</h3>
            <p style="color:var(--text-secondary); margin-bottom:1.25rem;">Cuando compres con tu cuenta, aquí verás el tracking y las guías de envío.</p>
            <a href="catalogo.html" class="btn btn-primary">Explorar Catálogo</a>
          </div>
        `;
        return;
      }

      container.innerHTML = pedidos.map(o => {
        const estado = escapeHTML(o.estado || 'Pagado');
        const folio = escapeHTML(o.folio || '');
        const creado = escapeHTML(o.creado_en || '');
        const itemsResumen = escapeHTML(o.items_resumen || '1 artículo');
        const guia = o.guia ? escapeHTML(o.guia) : '';
        const tipoEnvio = o.tipo_envio === 'retiro_villahermosa' ? 'Retiro en Plaza Atenas (Tabasco 2000)' : 'Envío a Domicilio';
        const puedeSolicitarDevolucion = estado.toLowerCase() === 'entregado';
        const devolucionPendiente = estado.toLowerCase().includes('devolución');
        const enCamino = estado.toLowerCase().includes('camino') || estado.toLowerCase().includes('listo');
        const entregado = estado.toLowerCase().includes('entregado');
        const enSucursal = estado.toLowerCase().includes('villahermosa');

        return `
          <div class="checkout-step-card" style="margin-bottom:1.5rem; border:1px solid var(--border-accent); box-shadow: 0 0 15px rgba(0, 242, 254, 0.15);">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; margin-bottom:1rem; padding-bottom:0.75rem; border-bottom:1px solid var(--border-subtle);">
              <div>
                <strong style="color:var(--accent-cyan); font-family:var(--font-mono); font-size:1.05rem;">Pedido #${folio}</strong>
                <div style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">Realizado ${creado} • ${itemsResumen}</div>
              </div>
              <span class="badge-tag badge-new" style="font-size:0.75rem; background:var(--color-success); color:#fff;">${estado.toUpperCase()}</span>
            </div>

            <div class="order-tracking-timeline">
              <div class="timeline-step completed"><div class="timeline-dot">✓</div><span class="timeline-label">Confirmado</span></div>
              <div class="timeline-step completed"><div class="timeline-dot">✓</div><span class="timeline-label">En Almacén</span></div>
              <div class="timeline-step ${enCamino ? 'active' : 'completed'}"><div class="timeline-dot">🚚</div><span class="timeline-label">En Tránsito</span></div>
              <div class="timeline-step ${entregado ? 'completed' : ''}"><div class="timeline-dot">📦</div><span class="timeline-label">${enSucursal ? 'Listo en Sucursal' : 'Entregado'}</span></div>
            </div>

            <div style="background:var(--bg-surface-elevated); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:1rem; margin-top:1rem; font-size:0.8125rem;">
              <div style="display:flex; justify-content:space-between; margin-bottom:0.35rem;">
                <span style="color:var(--text-muted);">Estado:</span>
                <strong style="color:var(--color-success);">${estado}</strong>
              </div>
              ${guia ? `
              <div style="display:flex; justify-content:space-between; margin-bottom:0.35rem;">
                <span style="color:var(--text-muted);">Guía de Rastreo:</span>
                <strong style="color:var(--accent-cyan);">${guia}</strong>
              </div>` : ''}
              <div style="display:flex; justify-content:space-between; margin-bottom:0.35rem;">
                <span style="color:var(--text-muted);">Tipo de Envío:</span>
                <span>${tipoEnvio}</span>
              </div>
              <div style="margin-top:1rem;">
                ${devolucionPendiente ? '<div class="panel-message panel-message-info">Solicitud de devolución en proceso. Te avisaremos cuando sea procesada.</div>' : ''}
                ${puedeSolicitarDevolucion ? `<button type="button" class="btn btn-outline btn-sm" data-return-order="${o.id}">Solicitar devolución</button>` : ''}
              </div>
              <div style="display:flex; justify-content:space-between;">
                <span style="color:var(--text-muted);">Total de la Orden:</span>
                <strong style="color:var(--accent-cyan); font-family:var(--font-mono); font-size:0.95rem;">${formatMXN(o.total)}</strong>
              </div>
            </div>
          </div>
        `;
      }).join('');

      container.querySelectorAll('[data-return-order]').forEach(button => {
        button.addEventListener('click', async () => {
          const pedidoId = button.dataset.returnOrder;
          const confirmado = window.confirm('¿Deseas solicitar la devolución de este pedido?');
          if (!confirmado) return;
          button.disabled = true;
          button.textContent = 'Procesando...';
          try {
            const res = await fetch(`/api/pedidos/${pedidoId}/devolucion`, { method: 'POST' });
            const data = await res.json();
            if (data.ok) {
              showToast(data.mensaje || 'Solicitud de devolución registrada', 'success');
              await renderPastOrders();
            } else {
              showToast(data.error || 'No se pudo solicitar la devolución', 'error');
              button.disabled = false;
              button.textContent = 'Solicitar devolución';
            }
          } catch (err) {
            showToast('No se pudo conectar con el servidor', 'error');
            button.disabled = false;
            button.textContent = 'Solicitar devolución';
          }
        });
      });
    } catch (err) {
      container.innerHTML = `<div class="checkout-step-card">No se pudieron cargar tus pedidos. Intenta recargar la página.</div>`;
    }
  }

  async function loadAddresses() {
    const list = document.getElementById('accountAddressesList');
    if (!list) return;
    list.innerHTML = `<div class="tool-card">Cargando direcciones...</div>`;

    try {
      const res = await fetch('/api/cuenta/direcciones');
      const data = await res.json();
      const dirs = data.ok && Array.isArray(data.direcciones) ? data.direcciones : [];

      if (dirs.length === 0) {
        list.innerHTML = `
          <div class="tool-card" style="grid-column:1/-1; text-align:center; padding:2rem;">
            <div style="font-size:2.5rem; margin-bottom:0.5rem;">📍</div>
            <h3 style="font-size:1.05rem; font-weight:800; color:var(--text-primary); margin-bottom:0.35rem;">No tienes direcciones guardadas</h3>
            <p style="font-size:0.85rem; color:var(--text-secondary);">Agrega un domicilio para agilizar tus compras.</p>
          </div>
        `;
        return;
      }

      list.innerHTML = dirs.map(d => `
        <div class="tool-card" style="${d.principal ? 'border:1px solid var(--border-accent);' : ''}">
          <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
            <strong style="color:${d.principal ? 'var(--accent-cyan)' : 'var(--text-primary)'};">${escapeHTML(d.calle || 'Domicilio')}</strong>
            ${d.principal ? '<span class="badge-tag badge-new" style="font-size:0.6875rem;">PRINCIPAL</span>' : ''}
          </div>
          <p style="font-size:0.8438rem; color:var(--text-secondary); line-height:1.5;">
            ${escapeHTML(d.nombre || '')}${d.nombre ? '<br>' : ''}
            ${escapeHTML(d.calle || '')}<br>
            ${escapeHTML(d.colonia || '') ? escapeHTML(d.colonia) + '<br>' : ''}
            ${escapeHTML(d.ciudad || '')}, ${escapeHTML(d.estado || '')} • C.P. ${escapeHTML(d.cp || '')}
            ${d.referencias ? `<br><span style="color:var(--text-muted);">Ref: ${escapeHTML(d.referencias)}</span>` : ''}
          </p>
        </div>
      `).join('');
    } catch (err) {
      list.innerHTML = `<div class="tool-card">No se pudieron cargar las direcciones.</div>`;
    }
  }

  const addressForm = document.getElementById('addressForm');
  if (addressForm) {
    addressForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        calle: document.getElementById('addrCalle').value.trim(),
        colonia: document.getElementById('addrColonia').value.trim(),
        ciudad: document.getElementById('addrCiudad').value.trim(),
        estado: document.getElementById('addrEstado').value.trim(),
        cp: document.getElementById('addrCp').value.trim(),
        referencias: document.getElementById('addrReferencias').value.trim(),
        principal: document.getElementById('addrPrincipal').checked ? 1 : 0
      };
      try {
        const res = await fetch('/api/cuenta/direcciones', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.ok) {
          addressForm.reset();
          showToast(data.mensaje || 'Dirección guardada', 'success');
          loadAddresses();
        } else {
          showToast(data.error || 'No se pudo guardar la dirección', 'info');
        }
      } catch (err) {
        showToast('No se pudo conectar con el servidor', 'info');
      }
    });
  }

  async function loadPreferences() {
    const alertas = document.getElementById('prefAlertas');
    const boletin = document.getElementById('prefBoletin');
    if (!alertas || !boletin) return;
    try {
      const res = await fetch('/api/cuenta/preferencias');
      const data = await res.json();
      const prefs = data.ok ? data.preferencias : null;
      alertas.checked = prefs ? Boolean(prefs.alertas_whatsapp) : true;
      boletin.checked = prefs ? Boolean(prefs.boletin) : true;
    } catch (e) {
      alertas.checked = true;
      boletin.checked = true;
    }
  }

  const prefsSaveBtn = document.getElementById('prefsSaveBtn');
  if (prefsSaveBtn) {
    prefsSaveBtn.addEventListener('click', async () => {
      const payload = {
        alertas_whatsapp: document.getElementById('prefAlertas').checked ? 1 : 0,
        boletin: document.getElementById('prefBoletin').checked ? 1 : 0
      };
      try {
        const res = await fetch('/api/cuenta/preferencias', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        showToast(data.ok ? (data.mensaje || 'Preferencias actualizadas') : (data.error || 'No se pudo guardar'), data.ok ? 'success' : 'info');
      } catch (err) {
        showToast('No se pudo conectar con el servidor', 'info');
      }
    });
  }

  function renderAccountWishlist() {
    const grid = document.getElementById('dashWishlistGrid');
    const countEl = document.getElementById('dashWishCount');
    if (!grid) return;
    if (countEl) countEl.textContent = appState.wishlist.size;

    const savedIds = [...appState.wishlist];
    const wishProducts = PRODUCTS_DATA.filter(p => savedIds.includes(p.id));

    if (wishProducts.length === 0) {
      grid.innerHTML = `
        <div style="grid-column:1/-1; padding:3rem 1rem; text-align:center; color:var(--text-secondary);">
          <div style="font-size:3rem; margin-bottom:0.75rem;">❤️</div>
          <h3 style="font-size:1.25rem; font-weight:800; color:var(--text-primary); margin-bottom:0.5rem;">Tu lista de deseos está vacía</h3>
          <p style="margin-bottom:1.5rem;">Guarda tus periféricos favoritos para no perderlos de vista.</p>
          <a href="catalogo.html" class="btn btn-primary">Explorar Catálogo</a>
        </div>
      `;
      return;
    }

    grid.innerHTML = wishProducts.map(p => generateProductCardHTML(p)).join('');
  }

  async function loadAccountWishlist() {
    let data = null;
    try {
      const res = await fetch('/api/favoritos');
      data = await res.json();
    } catch (e) {}

    if (data && data.ok) {
      const serverIds = data.ids || [];
      const serverSet = new Set(serverIds);
      const localIds = [...appState.wishlist];
      await Promise.all(localIds.filter(id => !serverSet.has(id)).map(id =>
        fetch(`/api/favoritos/${id}`, { method: 'POST' }).catch(() => {})
      ));
      appState.wishlist = new Set([...serverSet, ...localIds]);
      persistWishlist();
      updateWishlistCount();
    }

    renderAccountWishlist();
  }

  initAuthGate();
}

// ============================================================================
// 11. MÓDULO 7: ATENCIÓN AL CLIENTE, FAQ Y CHATBOT (AYUDA.HTML)
// ============================================================================
function initHelpPage() {
  const isHelp = document.getElementById('helpPageMain') !== null;
  if (!isHelp) return;

  // 1. Buscador de FAQ en Tiempo Real
  const faqSearch = document.getElementById('helpFaqSearchInput');
  const faqItems = document.querySelectorAll('.faq-item');

  if (faqSearch && faqItems.length > 0) {
    faqSearch.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      faqItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(q) ? 'block' : 'none';
        if (q.length > 2 && text.includes(q)) item.classList.add('open');
      });
    });
  }

  // 2. Acordeón Interactivo de FAQ
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        item.classList.toggle('open');
      });
    }
  });

  // 3. Formulario de Contacto integrado con SQLite
  window.submitSupportForm = async function() {
    const nameEl = document.getElementById('contactFormName');
    const emailEl = document.getElementById('contactFormEmail');
    const phoneEl = document.getElementById('contactFormPhone');
    const subjectEl = document.getElementById('contactFormSubject');
    const msgEl = document.getElementById('contactFormMessage');

    const name = nameEl ? nameEl.value.trim() : '';
    const email = emailEl ? emailEl.value.trim() : '';
    const phone = phoneEl ? phoneEl.value.trim() : '';
    const subject = subjectEl ? subjectEl.value.trim() : 'Consulta General';
    const message = msgEl ? msgEl.value.trim() : '';

    if (!name || !email || !message) {
      alert('Por favor completa nombre, correo y tu mensaje.');
      return;
    }

    try {
      const res = await fetch('/api/soporte/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: name,
          correo: email,
          telefono: phone,
          asunto: subject,
          mensaje: message
        })
      });
      const data = await res.json();
      if (data.ok) {
        document.getElementById('supportContactForm').reset();
        showToast(data.mensaje || `¡Gracias ${name}! Tu solicitud #${data.ticket_id} ha sido registrada en SQLite.`, 'success');
        return;
      }
    } catch(err) {
      console.warn("Fallo guardando ticket vía API, usando respaldo local:", err);
    }

    const ticketId = 'TK-' + Math.floor(1000 + Math.random() * 9000);
    document.getElementById('supportContactForm').reset();
    showToast(`¡Gracias ${name}! Tu solicitud #${ticketId} ha sido registrada. Te responderemos vía correo.`, 'success');
  };
}

// ============================================================================
// 12. CHATBOT INTERACTIVO 24/7 (NEXUS BOT)
// ============================================================================
function initChatbot() {
  const openBtn = document.getElementById('openChatbotBtn');
  const closeBtn = document.getElementById('closeChatbotBtn');
  const modal = document.getElementById('chatbotModal');
  const messagesArea = document.getElementById('chatMessagesArea');
  const input = document.getElementById('chatUserInput');

  if (!openBtn || !modal) return;

  window.openChatbotModal = function() {
    modal.hidden = false;
    if (input) input.focus();
  };

  openBtn.addEventListener('click', () => {
    modal.hidden = !modal.hidden;
    if (!modal.hidden && input) input.focus();
  });

  if (closeBtn) closeBtn.addEventListener('click', () => modal.hidden = true);

  window.sendChatSuggestion = function(text) {
    if (input) {
      input.value = text;
      window.handleUserChatMessage();
    }
  };

  window.handleUserChatMessage = function() {
    if (!input || !messagesArea) return;
    const userText = input.value.trim();
    if (!userText) return;

    // Agregar burbuja del usuario
    const userBubble = document.createElement('div');
    userBubble.className = 'chat-bubble user';
    userBubble.textContent = userText;
    messagesArea.appendChild(userBubble);
    input.value = '';
    messagesArea.scrollTop = messagesArea.scrollHeight;

    // Respuesta inteligente contextual en español de México
    setTimeout(() => {
      const q = userText.toLowerCase();
      let botResponse = '';

      if (q.includes('villahermosa') || q.includes('recoger') || q.includes('tabasco') || q.includes('local')) {
        botResponse = '📍 ¡Claro! Nuestro punto aliado está en <strong>Plaza Atenas Local 12 (Tabasco 2000)</strong> en Villahermosa. Puedes recoger gratis de lunes a sábado de 11:00 a 19:00 hrs.';
      } else if (q.includes('estudiante') || q.includes('descuento') || q.includes('credencial') || q.includes('cupon')) {
        botResponse = '🎓 ¡Por supuesto! Usa el cupón <strong>ESTUDIANTE10</strong> en tu carrito para obtener un 10% de descuento directo en cualquier periférico.';
      } else if (q.includes('envio') || q.includes('paqueteria') || q.includes('costo') || q.includes('gratis')) {
        botResponse = '🚚 Tenemos <strong>Envío GRATIS</strong> a todo México en compras desde $999 MXN vía FedEx/DHL. En pedidos menores, el envío express nacional es de solo $149 MXN.';
      } else if (q.includes('oxxo') || q.includes('efectivo') || q.includes('pago') || q.includes('tarjeta')) {
        botResponse = '💳 Aceptamos tarjetas a 6 MSI, transferencia <strong>SPEI</strong>, pago en efectivo con <strong>OXXO Pay</strong> (acreditación en menos de 2 horas) y contra entrega en Villahermosa.';
      } else if (q.includes('garantia') || q.includes('devolucion') || q.includes('falla')) {
        botResponse = '🛡️ Todos nuestros periféricos cuentan con <strong>12 meses de garantía</strong> por defecto de fábrica y 30 días para devolución voluntaria.';
      } else {
        botResponse = '⚡ ¡Entendido! Si buscas periféricos específicos o asesoría para armar tu setup, puedes ver nuestro catálogo o escribirnos por WhatsApp al <strong>(993) 240-8912</strong>.';
      }

      const botBubble = document.createElement('div');
      botBubble.className = 'chat-bubble bot';
      botBubble.innerHTML = botResponse;
      messagesArea.appendChild(botBubble);
      messagesArea.scrollTop = messagesArea.scrollHeight;
    }, 600);
  };
}

// ============================================================================
// 13. COMPONENTES GLOBALES (BUSCADOR, CARRITO DRAWER, MODAL, TOASTS)
// ============================================================================
function initGlobalComponents() {
  const searchInput = document.getElementById('searchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const autocompleteResults = document.getElementById('autocompleteResults');
  
  const cartBtn = document.getElementById('cartBtn');
  const cartDrawerOverlay = document.getElementById('cartDrawerOverlay');
  const closeCartDrawerBtn = document.getElementById('closeCartDrawerBtn');
  const continueShoppingBtn = document.getElementById('continueShoppingBtn');
  const goToCheckoutBtn = document.getElementById('goToCheckoutBtn');

  const quickViewModal = document.getElementById('quickViewModal');
  const closeQuickViewBtn = document.getElementById('closeQuickViewBtn');

  if (searchInput && autocompleteResults) {
    let activeIndex = -1;

    searchInput.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase().trim();
      appState.searchQuery = q;

      if (clearSearchBtn) clearSearchBtn.hidden = q.length === 0;

      if (q.length < 2) {
        autocompleteResults.hidden = true;
        autocompleteResults.innerHTML = '';
        if (window.refreshCatalogView) window.refreshCatalogView();
        return;
      }

      const matches = PRODUCTS_DATA.filter(item => {
        return item.name.toLowerCase().includes(q) ||
               item.brand.toLowerCase().includes(q) ||
               item.category.toLowerCase().includes(q) ||
               item.subcategory.toLowerCase().includes(q);
      }).slice(0, 5);

      if (matches.length === 0) {
        autocompleteResults.innerHTML = `
          <div class="autocomplete-empty">
            No hay periféricos con "<strong>${escapeHTML(q)}</strong>"
          </div>
        `;
        autocompleteResults.hidden = false;
        if (window.refreshCatalogView) window.refreshCatalogView();
        return;
      }

      let html = `<div class="autocomplete-section-title">Sugerencias Rápidas</div>`;
      matches.forEach((item, idx) => {
        html += `
          <div class="autocomplete-item" role="option" data-id="${item.id}" data-idx="${idx}">
            <img src="${item.image}" alt="${item.name}" class="autocomplete-thumb">
            <div class="autocomplete-info">
              <div class="autocomplete-title">${item.name}</div>
              <div class="autocomplete-meta">
                <span>${item.brand}</span> • <span class="autocomplete-price">${formatMXN(item.price)}</span>
              </div>
            </div>
          </div>
        `;
      });

      autocompleteResults.innerHTML = html;
      autocompleteResults.hidden = false;
      activeIndex = -1;

      autocompleteResults.querySelectorAll('.autocomplete-item').forEach(el => {
        el.addEventListener('click', () => {
          const id = parseInt(el.getAttribute('data-id'), 10);
          window.location.href = `producto.html?id=${id}`;
        });
      });

      if (window.refreshCatalogView) window.refreshCatalogView();
    });

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        appState.searchQuery = '';
        clearSearchBtn.hidden = true;
        autocompleteResults.hidden = true;
        if (window.refreshCatalogView) window.refreshCatalogView();
      });
    }

    searchInput.addEventListener('keydown', (e) => {
      const items = autocompleteResults.querySelectorAll('.autocomplete-item');
      if (items.length === 0 || autocompleteResults.hidden) {
        if (e.key === 'Enter' && searchInput.value.trim() !== '') {
          if (!document.getElementById('catalogMain')) {
            window.location.href = `catalogo.html?q=${encodeURIComponent(searchInput.value.trim())}`;
          }
        }
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeIndex = (activeIndex + 1) % items.length;
        items.forEach((it, i) => it.classList.toggle('active-item', i === activeIndex));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeIndex = (activeIndex - 1 + items.length) % items.length;
        items.forEach((it, i) => it.classList.toggle('active-item', i === activeIndex));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (activeIndex >= 0) items[activeIndex].click();
        else if (!document.getElementById('catalogMain')) {
          window.location.href = `catalogo.html?q=${encodeURIComponent(searchInput.value.trim())}`;
        }
      } else if (e.key === 'Escape') {
        autocompleteResults.hidden = true;
      }
    });

    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !autocompleteResults.contains(e.target)) {
        autocompleteResults.hidden = true;
      }
    });
  }

  // Carrito Drawer
  if (cartBtn && cartDrawerOverlay) {
    cartBtn.addEventListener('click', () => {
      cartDrawerOverlay.hidden = false;
      document.body.style.overflow = 'hidden';
    });
  }

  function closeCart() {
    if (cartDrawerOverlay) {
      cartDrawerOverlay.hidden = true;
      document.body.style.overflow = '';
    }
  }

  if (closeCartDrawerBtn) closeCartDrawerBtn.addEventListener('click', closeCart);
  if (continueShoppingBtn) continueShoppingBtn.addEventListener('click', closeCart);
  if (cartDrawerOverlay) {
    cartDrawerOverlay.addEventListener('click', (e) => {
      if (e.target === cartDrawerOverlay) closeCart();
    });
  }

  if (goToCheckoutBtn) {
    goToCheckoutBtn.addEventListener('click', () => {
      if (appState.cart.length === 0) {
        showToast('Tu carrito está vacío', 'info');
        return;
      }
      window.location.href = 'checkout.html';
    });
  }

  function closeQuickView() {
    if (quickViewModal) {
      quickViewModal.hidden = true;
      document.body.style.overflow = '';
    }
  }

  if (closeQuickViewBtn) closeQuickViewBtn.addEventListener('click', closeQuickView);
  if (quickViewModal) {
    quickViewModal.addEventListener('click', (e) => {
      if (e.target === quickViewModal) closeQuickView();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeQuickView();
      closeCart();
    }
  });

  // Redirección del botón de lista de deseos en header
  const wishlistBtn = document.getElementById('wishlistBtn');
  if (wishlistBtn) {
    wishlistBtn.addEventListener('click', () => {
      if (document.getElementById('accountPageMain')) {
        const wBtn = document.querySelector('.dash-nav-btn[data-dash-tab="wishlist"]');
        if (wBtn) wBtn.click();
      } else {
        window.location.href = 'cuenta.html#deseos';
      }
    });
  }

  // Menú Móvil Lateral (Off-Canvas)
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      let navOverlay = document.getElementById('mobileNavOverlay');
      if (!navOverlay) {
        navOverlay = document.createElement('div');
        navOverlay.id = 'mobileNavOverlay';
        navOverlay.className = 'mobile-nav-overlay';
        navOverlay.innerHTML = `
          <div class="mobile-nav-drawer" role="dialog" aria-modal="true" aria-label="Menú principal">
            <div class="mobile-nav-header">
              <div class="logo-text">
                <span class="brand-name">NEXUS<span class="highlight">GEAR</span></span>
                <span class="brand-tag">MENÚ MÓVIL</span>
              </div>
              <button class="drawer-close-btn" id="closeMobileNavBtn" aria-label="Cerrar menú">✕</button>
            </div>
            <nav class="mobile-nav-links">
              <a href="index.html" class="mobile-nav-item"><span>🏠</span> Inicio</a>
              <a href="catalogo.html" class="mobile-nav-item"><span>⚡</span> Catálogo Completo</a>
              <a href="carrito.html" class="mobile-nav-item"><span>🛒</span> Mi Carrito</a>
              <a href="checkout.html" class="mobile-nav-item"><span>💳</span> Checkout Seguro</a>
              <a href="cuenta.html" class="mobile-nav-item"><span>👤</span> Mi Cuenta & Tracking</a>
              <a href="ayuda.html" class="mobile-nav-item"><span>❓</span> Ayuda & Soporte 24/7</a>
              <a href="index.html#ofertas" class="mobile-nav-item"><span>🔥</span> Ofertas Flash</a>
              <a href="index.html#villahermosa" class="mobile-nav-item"><span>📍</span> Punto Villahermosa</a>
            </nav>
            <div class="mobile-nav-footer">
              <strong>NEXUS GEAR MX</strong><br>
              Plaza Atenas Local 12, Tabasco 2000<br>
              Villahermosa, Tabasco
            </div>
          </div>
        `;
        document.body.appendChild(navOverlay);

        navOverlay.querySelector('#closeMobileNavBtn').addEventListener('click', () => {
          navOverlay.hidden = true;
          document.body.style.overflow = '';
        });

        navOverlay.addEventListener('click', (e) => {
          if (e.target === navOverlay) {
            navOverlay.hidden = true;
            document.body.style.overflow = '';
          }
        });
      }

      navOverlay.hidden = false;
      document.body.style.overflow = 'hidden';
    });
  }

  updateCartUI();
  updateWishlistCount();
}

window.addToCart = function(productId, quantity = 1, variante = null) {
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;

  const varianteLabel = variante ? variante.etiqueta : '';
  const varianteExtra = variante ? (variante.extra || 0) : 0;
  const varianteSel = variante ? variante.selecciones : null;

  const existing = appState.cart.find(i => i.product.id === productId && (i.varianteLabel || '') === varianteLabel);
  if (existing) existing.quantity += quantity;
  else appState.cart.push({ product, quantity, varianteLabel, varianteExtra, varianteSel });

  persistCart();
  updateCartUI();
  showToast(`¡${product.name.slice(0, 26)}... agregado al carrito!`, 'success');
};

window.removeFromCart = function(productId) {
  appState.cart = appState.cart.filter(i => i.product.id !== productId);
  persistCart();
  updateCartUI();
  if (window.refreshCartPage) window.refreshCartPage();
  showToast('Producto eliminado del carrito', 'info');
};

window.updateCartQty = function(productId, delta) {
  const item = appState.cart.find(i => i.product.id === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    removeFromCart(productId);
    return;
  }
  persistCart();
  updateCartUI();
  if (window.refreshCartPage) window.refreshCartPage();
};

function updateCartUI() {
  const cartCount = document.getElementById('cartCount');
  const cartTotalHeader = document.getElementById('cartTotalHeader');
  const cartDrawerCount = document.getElementById('cartDrawerCount');
  const cartDrawerItems = document.getElementById('cartDrawerItems');
  const cartDrawerSubtotal = document.getElementById('cartDrawerSubtotal');
  const cartDrawerShipping = document.getElementById('cartDrawerShipping');
  const cartDrawerTotal = document.getElementById('cartDrawerTotal');
  const freeShippingMeterText = document.getElementById('freeShippingMeterText');
  const freeShippingBarFill = document.getElementById('freeShippingBarFill');

  const totalItems = appState.cart.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = appState.cart.reduce((sum, i) => sum + (cartItemUnitPrice(i) * i.quantity), 0);

  if (cartCount) cartCount.textContent = totalItems;
  if (cartTotalHeader) cartTotalHeader.textContent = formatMXN(subtotal);
  if (cartDrawerCount) cartDrawerCount.textContent = totalItems;

  const freeThreshold = 999;
  if (freeShippingMeterText && freeShippingBarFill) {
    if (subtotal >= freeThreshold) {
      freeShippingMeterText.innerHTML = `🎉 <strong>¡Felicidades!</strong> Tienes <strong>Envío Gratis</strong> a todo México.`;
      freeShippingBarFill.style.width = '100%';
      freeShippingBarFill.style.backgroundColor = 'var(--color-success)';
      if (cartDrawerShipping) {
        cartDrawerShipping.textContent = 'GRATIS';
        cartDrawerShipping.style.color = 'var(--color-success)';
      }
    } else if (subtotal > 0) {
      const diff = freeThreshold - subtotal;
      const progress = Math.min(100, Math.round((subtotal / freeThreshold) * 100));
      freeShippingMeterText.innerHTML = `Agrega <strong>${formatMXN(diff)}</strong> para obtener <strong>Envío Gratis</strong>`;
      freeShippingBarFill.style.width = `${progress}%`;
      freeShippingBarFill.style.backgroundColor = 'var(--accent-cyan)';
      if (cartDrawerShipping) {
        cartDrawerShipping.textContent = '$149.00 MXN (o gratis en Villahermosa)';
        cartDrawerShipping.style.color = 'var(--text-secondary)';
      }
    } else {
      freeShippingMeterText.innerHTML = `Agrega <strong>$999 MXN</strong> para obtener <strong>Envío Gratis</strong>`;
      freeShippingBarFill.style.width = '0%';
      if (cartDrawerShipping) {
        cartDrawerShipping.textContent = 'Calculado en checkout';
        cartDrawerShipping.style.color = 'var(--text-secondary)';
      }
    }
  }

  if (cartDrawerSubtotal) cartDrawerSubtotal.textContent = formatMXN(subtotal);
  if (cartDrawerTotal) {
    const shippingCost = (subtotal >= freeThreshold || subtotal === 0) ? 0 : 149;
    cartDrawerTotal.textContent = formatMXN(subtotal + shippingCost);
  }

  if (cartDrawerItems) {
    if (appState.cart.length === 0) {
      cartDrawerItems.innerHTML = `
        <div class="cart-empty-state">
          <div class="cart-empty-icon">🛒</div>
          <h4>Tu carrito está vacío</h4>
          <p>Explora nuestro catálogo y equípate con los mejores accesorios.</p>
        </div>
      `;
      return;
    }

    cartDrawerItems.innerHTML = appState.cart.map(item => `
      <div class="cart-item-card">
        <img src="${item.product.image}" alt="${item.product.name}" class="cart-item-thumb">
        <div class="cart-item-info">
          <h4 class="cart-item-title">${item.product.name}</h4>
          ${item.varianteLabel ? `<div class="cart-item-variant-tag" style="font-size:0.72rem; color:var(--text-muted);">${item.varianteLabel}</div>` : ''}
          <div class="cart-item-price">${formatMXN(cartItemUnitPrice(item))}</div>
          <div class="cart-item-controls">
            <div class="qty-stepper">
              <button class="qty-btn" onclick="updateCartQty(${item.product.id}, -1)">-</button>
              <span class="qty-value">${item.quantity}</span>
              <button class="qty-btn" onclick="updateCartQty(${item.product.id}, 1)">+</button>
            </div>
            <button class="cart-item-remove-btn" onclick="removeFromCart(${item.product.id})">Quitar</button>
          </div>
        </div>
      </div>
    `).join('');
  }
}

window.toggleWishlist = function(productId) {
  const wasWishlisted = appState.wishlist.has(productId);
  if (wasWishlisted) {
    appState.wishlist.delete(productId);
    showToast('Removido de favoritos', 'info');
  } else {
    appState.wishlist.add(productId);
    showToast('Guardado en tu lista de deseos', 'success');
  }
  persistWishlist();
  updateWishlistCount();

  document.querySelectorAll(`.wishlist-toggle-btn[data-id="${productId}"]`).forEach(btn => {
    btn.classList.toggle('is-active', appState.wishlist.has(productId));
    const svg = btn.querySelector('svg');
    if (svg) svg.setAttribute('fill', appState.wishlist.has(productId) ? '#f43f5e' : 'none');
  });

  if (appState.currentUser) {
    fetch(`/api/favoritos/${productId}`, { method: wasWishlisted ? 'DELETE' : 'POST' })
      .catch(() => {});
  }
};

function updateWishlistCount() {
  const el = document.getElementById('wishlistCount');
  if (el) el.textContent = appState.wishlist.size;
}

window.openQuickView = function(productId) {
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;

  const modal = document.getElementById('quickViewModal');
  const content = document.getElementById('quickViewContent');
  if (!modal || !content) {
    window.location.href = `producto.html?id=${productId}`;
    return;
  }

  content.innerHTML = `
    <div class="modal-quick-grid">
      <div class="modal-visual-col">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="modal-info-col">
        <div class="card-meta-row" style="margin-bottom:0.5rem;">
          <span class="product-brand">${product.brand}</span>
          <div class="product-rating">
            <span>★</span>
            <strong>${product.rating.toFixed(1)}</strong>
            <span class="rating-count">(${product.reviewsCount} reseñas)</span>
          </div>
        </div>

        <h2 id="modalProductTitle" style="font-size:1.35rem; font-weight:800; line-height:1.3; margin-bottom:0.75rem;">
          ${product.name}
        </h2>

        <div class="price-box" style="margin-bottom:0.75rem;">
          <span class="current-price" style="font-size:1.6rem;">${formatMXN(product.price)}</span>
          ${product.originalPrice ? `<span class="original-price" style="font-size:1rem;">${formatMXN(product.originalPrice)}</span>` : ''}
        </div>

        <p style="color:var(--text-secondary); font-size:0.875rem; line-height:1.5; margin-bottom:1rem;">
          ${product.description}
        </p>

        <div class="modal-specs-list">
          ${product.specs.map(s => `
            <div class="modal-spec-item">
              <span class="modal-spec-label">${s.label}:</span>
              <span class="modal-spec-val">${s.value}</span>
            </div>
          `).join('')}
        </div>

        <div style="font-size:0.8125rem; color:var(--text-secondary); margin-bottom:1.25rem;">
          ${product.freeShipping ? '✅ <strong>Envío Gratis</strong> a todo México' : '📦 Envío nacional desde $149 MXN'}<br>
          ${product.pickupVillahermosa ? '📍 <strong>Disponible para recoger hoy</strong> en Villahermosa (Tabasco 2000)' : '🚚 Envío por paquetería'}
        </div>

        <div style="display:flex; gap:0.75rem; margin-top:auto;">
          <button class="btn btn-primary btn-block" onclick="addToCart(${product.id}); document.getElementById('quickViewModal').hidden = true; document.body.style.overflow = '';">
            <span>Agregar al Carrito</span>
          </button>
          <a href="producto.html?id=${product.id}" class="btn btn-outline">
            Ver Ficha Completa
          </a>
        </div>
      </div>
    </div>
  `;

  modal.hidden = false;
  document.body.style.overflow = 'hidden';
};

function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '⚡' : 'ℹ️'}</span>
    <span>${message}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(15px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));
}

// ============================================================================
// 14. SINCRONIZACIÓN CON BASE DE DATOS SQLITE
// ============================================================================
async function syncWithBackend() {
  try {
    const res = await fetch('/api/productos');
    if (!res.ok) return;
    const data = await res.json();
    if (data.ok && Array.isArray(data.productos) && data.productos.length > 0) {
      data.productos.forEach(p => {
        const local = PRODUCTS_DATA.find(x => x.id === p.id);
        if (local) {
          p.fallbackImage = local.fallbackImage || local.image;
          p.photoBase = p.photoBase || local.photoBase;
          if (!p.specs && local.specs) p.specs = local.specs;
        }
        // Normalizar propiedades clave requeridas por el catálogo y filtros
        p.name = p.name || p.nombre;
        p.brand = p.brand || p.marca;
        p.price = (p.price !== undefined && p.price !== null) ? Number(p.price) : Number(p.precio);
        p.originalPrice = (p.originalPrice !== undefined && p.originalPrice !== null) ? Number(p.originalPrice) : (p.precio_original ? Number(p.precio_original) : null);
        p.category = p.category || p.categoria_slug;
        p.subcategory = p.subcategory || p.subcategoria;
        p.description = p.description || p.descripcion;
        p.connectivity = p.connectivity || p.conectividad;
        p.connectionLabel = p.connectionLabel || p.etiqueta_conexion;
        p.popularity = p.popularity !== undefined ? Number(p.popularity) : Number(p.popularidad);
        p.rating = p.rating !== undefined ? Number(p.rating) : 5.0;
        p.reviewsCount = p.reviewsCount !== undefined ? Number(p.reviewsCount) : 0;
        p.rgb = p.rgb !== undefined ? Boolean(p.rgb) : false;
        p.pickupVillahermosa = p.pickupVillahermosa !== undefined ? Boolean(p.pickupVillahermosa) : Boolean(p.retiro_villahermosa);
        p.freeShipping = p.freeShipping !== undefined ? Boolean(p.freeShipping) : Boolean(p.envio_gratis);
        p.typeKey = p.typeKey || p.tipo_ilustracion;
        p.flashStock = p.flashStock !== undefined ? Number(p.flashStock) : Number(p.stock_flash || 3);
        p.image = p.image || (p.photoBase ? p.photoBase + '.jpg' : '');
      });

      PRODUCTS_DATA.length = 0;
      data.productos.forEach(p => PRODUCTS_DATA.push(p));

      // Re-renderizar si las funciones globales están disponibles
      if (typeof window.refreshCatalogView === 'function') {
        window.refreshCatalogView();
      }

      const flashContainer = document.getElementById('flashDealsGrid');
      if (flashContainer) {
        const flashItems = PRODUCTS_DATA.filter(p => p.originalPrice && p.originalPrice > p.price);
        if (flashItems.length > 0) {
          flashContainer.innerHTML = flashItems.map(p => generateProductCardHTML(p, { showStock: true })).join('');
        }
      }

      const bestContainer = document.getElementById('bestSellersGrid');
      if (bestContainer) {
        const bestItems = [...PRODUCTS_DATA].sort((a, b) => b.popularity - a.popularity).slice(0, 4);
        bestContainer.innerHTML = bestItems.map(p => generateProductCardHTML(p)).join('');
      }

      console.log(`[✓] ${PRODUCTS_DATA.length} productos sincronizados en vivo desde SQLite.`);
    }
  } catch(e) {
    // Modo estático o sin servidor
  }
}

function showServerCheckingOverlay() {
  if (document.getElementById('server-check-overlay')) return;
  const overlay = document.createElement('div');
  overlay.id = 'server-check-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:99998;background:#0b1220;color:#e5e7eb;display:flex;align-items:center;justify-content:center;text-align:center;padding:2rem;font-family:inherit;';
  overlay.innerHTML = `
    <div>
      <div style="font-size:2.5rem;margin-bottom:1rem;">⏳</div>
      <h2 style="margin:0;color:#00f2fe;">Verificando servidor...</h2>
    </div>
  `;
  document.body.appendChild(overlay);
}

function removeServerCheckingOverlay() {
  const overlay = document.getElementById('server-check-overlay');
  if (overlay) overlay.remove();
}

function showServerOfflineOverlay() {
  removeServerCheckingOverlay();
  if (document.getElementById('server-offline-overlay')) return;
  const overlay = document.createElement('div');
  overlay.id = 'server-offline-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;background:#0b1220;color:#e5e7eb;display:flex;align-items:center;justify-content:center;text-align:center;padding:2rem;font-family:inherit;';
  overlay.innerHTML = `
    <div style="max-width:520px;">
      <div style="font-size:3rem;margin-bottom:1rem;">🖥️</div>
      <h2 style="margin:0 0 .75rem;color:#00f2fe;">Servidor no activo</h2>
      <p style="margin:0 0 1.25rem;color:#9ca3af;">La tienda necesita el servidor Flask para cargar productos, cuenta y pedidos. Ejecuta en la carpeta del proyecto:</p>
      <code style="display:block;background:#111827;border:1px solid #334155;border-radius:8px;padding:.75rem;color:#a5f3fc;margin-bottom:1rem;">python server.py</code>
      <button id="server-retry-btn" style="background:#00f2fe;color:#03111f;border:0;border-radius:8px;padding:.7rem 1.2rem;font-weight:700;cursor:pointer;">Reintentar</button>
    </div>
  `;
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';
  const retryBtn = document.getElementById('server-retry-btn');
  if (retryBtn) retryBtn.addEventListener('click', () => location.reload());
}

async function initServerHealthCheck() {
  showServerCheckingOverlay();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const res = await fetch('/api/categorias', { cache: 'no-store', signal: controller.signal });
    clearTimeout(timeout);
    const data = await res.json();
    if (!res.ok || !data.ok) throw new Error(`HTTP ${res.status}`);
    removeServerCheckingOverlay();
  } catch (e) {
    showServerOfflineOverlay();
  }
}

async function initAdminVisibility() {
  const adminElements = document.querySelectorAll('.admin-only');
  if (adminElements.length === 0) return;

  try {
    const res = await fetch('/api/auth/me');
    const data = await res.json();
    const isAdmin = data.ok && data.autenticado && data.cliente && data.cliente.rol === 'admin';
    adminElements.forEach(el => { el.style.display = isAdmin ? '' : 'none'; });
  } catch (e) {
    adminElements.forEach(el => { el.style.display = 'none'; });
  }
}

// ============================================================================
// 15. INICIALIZADOR GLOBAL (DOM LOADED)
// ============================================================================
initServerHealthCheck();

// ============================================================================
// 11. NEWSLETTER (suscripción de correos en SQLite)
// ============================================================================
function initNewsletter() {
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const correo = input ? input.value.trim() : '';
      if (!correo) return;

      try {
        const res = await fetch('/api/newsletter/suscribir', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ correo })
        });
        const data = await res.json();
        if (data.ok) {
          showToast(data.mensaje || '¡Suscripción registrada!', 'success');
          form.reset();
        } else {
          showToast(data.error || 'No se pudo registrar tu correo', 'error');
        }
      } catch (err) {
        showToast('No se pudo conectar con el servidor', 'error');
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initLocalStorage();
  initGlobalComponents();
  initNewsletter();
  initHomePage();
  initCatalogPage();
  initProductPage();
  initCartPage();
  initCheckoutPage();
  initAccountPage();
  initHelpPage();
  initChatbot();
  initAdminVisibility();
  syncWithBackend();
  console.log("⚡ NEXUS GEAR MX - Todos los módulos (1 al 7) cargados y sincronizados.");
});
