/* ==========================================================================
   PANEL ADMIN / VENDEDOR - NEXUS GEAR MX
   ========================================================================== */

const panelConfig = {
  admin: {
    title: 'Panel de Administrador',
    subtitle: 'Resumen, catálogo, pedidos y clientes de la tienda.',
    apiResumen: '/api/panel/admin/resumen',
    apiProductos: '/api/panel/admin/productos',
    apiPedidos: '/api/panel/admin/pedidos',
    apiClientes: '/api/panel/admin/usuarios',
    canEditProducts: true,
    canEditOrders: true,
    showClientes: true
  },
  vendedor: {
    title: 'Panel de Vendedor',
    subtitle: 'Administra los productos que tienes asignados en el catálogo.',
    apiResumen: '/api/panel/vendedor/resumen',
    apiProductos: '/api/panel/vendedor/productos',
    apiPedidos: '/api/panel/vendedor/pedidos',
    apiClientes: null,
    canEditProducts: true,
    canEditOrders: false,
    showClientes: false
  }
};

const panelState = {
  role: null,
  user: null,
  config: null,
  productos: [],
  pedidos: [],
  usuarios: [],
  editingProductId: null
};

function panelMoney(value) {
  return `$${Number(value || 0).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN`;
}

function panelEscape(value) {
  return String(value ?? '').replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}

function panelBadge(text, cls = '') {
  return `<span class="panel-badge ${cls}">${panelEscape(text)}</span>`;
}

async function panelFetch(url, options = {}) {
  const res = await fetch(url, {
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.ok === false) {
    throw new Error(data.error || `Error ${res.status}`);
  }
  return data;
}

function panelSetMessage(message, type = 'info') {
  const el = document.getElementById('panelMessage');
  if (!el) return;
  el.textContent = message;
  el.className = `panel-message panel-message-${type}`;
}

function renderPanelStats(stats) {
  const grid = document.getElementById('panelStatsGrid');
  if (!grid || !stats) return;
  const cards = [
    ['Productos', stats.productos_total ?? 0, stats.productos_activos != null ? `${stats.productos_activos} activos` : ''],
    ['Inventario', stats.stock_total ?? 0, stats.stock_bajo ? `${stats.stock_bajo} con stock bajo` : ''],
    ['Pedidos', stats.pedidos_total ?? 0, stats.pedidos_pendientes ? `${stats.pedidos_pendientes} pendientes` : ''],
    ['Ventas', panelMoney(stats.ventas_total), stats.pedidos_entregados ? `${stats.pedidos_entregados} entregados` : ''],
    ['Clientes', stats.usuarios_total ?? '—', stats.usuarios_nuevos_30d ? `${stats.usuarios_nuevos_30d} nuevos (30d)` : ''],
    ['Reseñas', stats.resenas_total ?? '—', stats.resenas_promedio ? `★ ${Number(stats.resenas_promedio).toFixed(1)}` : '']
  ];
  grid.innerHTML = cards.map(([label, value, sub]) => `
    <article class="panel-stat-card">
      <span class="panel-stat-label">${panelEscape(label)}</span>
      <strong class="panel-stat-value">${panelEscape(value)}</strong>
      <small class="panel-stat-sub">${panelEscape(sub || '')}</small>
    </article>
  `).join('');
}

function renderPanelProducts() {
  const body = document.getElementById('panelProductsBody');
  const empty = document.getElementById('panelProductsEmpty');
  if (!body) return;
  const rows = panelState.productos;
  if (empty) empty.hidden = rows.length > 0;
  if (!rows.length) {
    body.innerHTML = '';
    return;
  }

  body.innerHTML = rows.map(p => {
    const stock = Number(p.stock || 0);
    const stockClass = stock <= 5 ? 'panel-stock-low' : 'panel-stock-ok';
    const actions = panelState.config.canEditProducts ? `
      <div class="panel-row-actions">
        <button class="btn btn-outline btn-sm" data-action="edit-product" data-id="${p.id}">Editar</button>
        <button class="btn btn-outline btn-sm" data-action="edit-stock" data-id="${p.id}">Stock</button>
        <button class="btn btn-outline btn-sm" data-action="toggle-active" data-id="${p.id}">${p.activo ? 'Ocultar' : 'Activar'}</button>
      </div>` : '';
    return `
      <tr>
        <td><strong>#${p.id}</strong></td>
        <td>${panelEscape(p.nombre)}<br><small>${panelEscape(p.marca || '')}</small></td>
        <td>${panelEscape(p.categoria_nombre || p.categoria_slug || '—')}</td>
        <td>${panelMoney(p.precio)}</td>
        <td><span class="${stockClass}">${stock}</span></td>
        <td>${p.activo ? panelBadge('Activo', 'badge-ok') : panelBadge('Oculto', 'badge-muted')}</td>
        <td>${actions}</td>
      </tr>`;
  }).join('');

  body.querySelectorAll('[data-action="edit-product"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const product = panelState.productos.find(p => Number(p.id) === Number(btn.dataset.id));
      if (product) startProductEdit(product);
    });
  });
  body.querySelectorAll('[data-action="edit-stock"]').forEach(btn => {
    btn.addEventListener('click', () => editProductStock(Number(btn.dataset.id)));
  });
  body.querySelectorAll('[data-action="toggle-active"]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const product = panelState.productos.find(p => Number(p.id) === Number(btn.dataset.id));
      if (!product) return;
      await updateProduct(product.id, { activo: product.activo ? 0 : 1 });
    });
  });
}

function renderPanelPedidos() {
  const body = document.getElementById('panelOrdersBody');
  const empty = document.getElementById('panelOrdersEmpty');
  if (!body) return;
  const rows = panelState.pedidos;
  if (empty) empty.hidden = rows.length > 0;
  if (!rows.length) {
    body.innerHTML = '';
    return;
  }

  body.innerHTML = rows.map(o => {
    const estado = o.estado || 'Pendiente';
    const estadoClass = estado === 'Entregado' ? 'badge-ok' : (['Cancelado', 'Reembolsado', 'Devuelto'].includes(estado) ? 'badge-danger' : 'badge-warn');
    const items = o.items_resumen || '';
    const statusControl = panelState.config.canEditOrders ? `
      <select class="panel-select" data-order-id="${o.id}">
        ${['Pagado', 'Preparando', 'Listo en Villahermosa', 'En camino vía FedEx', 'Entregado', 'Devolución solicitada', 'Reembolsado', 'Devuelto', 'Cancelado'].map(e =>
          `<option value="${e}" ${e === estado ? 'selected' : ''}>${e}</option>`).join('')}
      </select>` : panelBadge(estado, estadoClass);
    return `
      <tr>
        <td><strong>${panelEscape(o.folio || `#${o.id}`)}</strong><br><small>${panelEscape(o.creado_en || '')}</small></td>
        <td>${panelEscape(o.nombre_contacto || 'Invitado')}<br><small>${panelEscape(o.correo_contacto || '')}</small></td>
        <td>${panelEscape(items)}</td>
        <td>${panelMoney(o.total)}</td>
        <td>${statusControl}</td>
      </tr>`;
  }).join('');

  body.querySelectorAll('select[data-order-id]').forEach(sel => {
    sel.addEventListener('change', async () => {
      try {
        await panelFetch(`/api/panel/admin/pedidos/${sel.dataset.orderId}/estado`, {
          method: 'PUT',
          body: JSON.stringify({ estado: sel.value })
        });
        panelSetMessage(`Pedido ${sel.dataset.orderId} actualizado a "${sel.value}".`, 'success');
        await loadPanelPedidos();
      } catch (err) {
        panelSetMessage(err.message, 'error');
        loadPanelPedidos();
      }
    });
  });
}

function renderPanelUsuarios() {
  const body = document.getElementById('panelUsersBody');
  const empty = document.getElementById('panelUsersEmpty');
  const section = document.getElementById('panelUsersSection');
  if (!body || !section) return;
  section.hidden = !panelState.config.showClientes;
  if (!panelState.config.showClientes) return;
  const rows = panelState.usuarios;
  if (empty) empty.hidden = rows.length > 0;
  if (!rows.length) {
    body.innerHTML = '';
    return;
  }
  body.innerHTML = rows.map(c => `
    <tr>
      <td><strong>${panelEscape(c.nombre)}</strong><br><small>${panelEscape(c.correo)}</small></td>
      <td>${panelEscape(c.telefono || '—')}</td>
      <td>${panelBadge(c.rol === 'admin' ? 'Admin' : (c.rol === 'vendedor' ? 'Vendedor' : 'Cliente'), c.rol === 'admin' ? 'badge-ok' : 'badge-muted')}</td>
      <td>${panelEscape(c.creado_en || '—')}</td>
      <td>${c.pedidos_total ?? 0} / ${panelMoney(c.ventas_total)}</td>
    </tr>`).join('');
}

async function loadPanelResumen() {
  const data = await panelFetch(panelState.config.apiResumen);
  renderPanelStats(data.resumen || {});
}

async function loadPanelProductos() {
  const data = await panelFetch(panelState.config.apiProductos);
  panelState.productos = data.productos || [];
  renderPanelProducts();
}

async function loadPanelPedidos() {
  const data = await panelFetch(panelState.config.apiPedidos);
  panelState.pedidos = data.pedidos || [];
  renderPanelPedidos();
}

async function loadPanelUsuarios() {
  if (!panelState.config.apiClientes) return;
  const data = await panelFetch(panelState.config.apiClientes);
  panelState.usuarios = data.usuarios || [];
  renderPanelUsuarios();
}

async function updateProduct(id, payload) {
  try {
    const endpoint = panelState.role === 'admin'
      ? `/api/panel/admin/productos/${id}`
      : `/api/panel/vendedor/productos/${id}`;
    await panelFetch(endpoint, { method: 'PUT', body: JSON.stringify(payload) });
    panelSetMessage('Producto actualizado.', 'success');
    await loadPanelProductos();
  } catch (err) {
    panelSetMessage(err.message, 'error');
  }
}

async function editProductStock(id) {
  const product = panelState.productos.find(p => Number(p.id) === id);
  if (!product) return;
  const next = window.prompt(`Nuevo stock para "${product.nombre}" (actual: ${product.stock}):`, product.stock);
  if (next === null) return;
  const stock = Number(next);
  if (!Number.isInteger(stock) || stock < 0) {
    panelSetMessage('El stock debe ser un entero mayor o igual a 0.', 'error');
    return;
  }
  await updateProduct(id, { stock });
}

function resetProductForm() {
  panelState.editingProductId = null;
  const form = document.getElementById('productForm');
  if (form) {
    form.reset();
    const section = form.closest('section');
    const heading = section ? section.querySelector('.panel-section-header h2') : null;
    const subheading = section ? section.querySelector('.panel-section-header p') : null;
    if (heading) heading.textContent = 'Publicar producto';
    if (subheading) subheading.textContent = 'Alta rápida para mantener el catálogo actualizado.';
  }
  const hint = document.getElementById('productFotoHint');
  if (hint) hint.textContent = '';
  const btn = document.getElementById('productSubmitBtn');
  if (btn) btn.textContent = 'Publicar producto';
  const cancel = document.getElementById('cancelProductEdit');
  if (cancel) cancel.hidden = true;
  const sellerField = document.getElementById('productSellerField');
  if (sellerField) sellerField.hidden = panelState.role !== 'admin';
}

function startProductEdit(product) {
  panelState.editingProductId = product.id;
  const form = document.getElementById('productForm');
  if (!form) return;

  const setValue = (name, value) => {
    const el = form.querySelector(`[name="${name}"]`);
    if (!el) return;
    if (el.type === 'checkbox') el.checked = Boolean(value);
    else el.value = value ?? '';
  };

  setValue('categoria_id', product.categoria_id);
  setValue('nombre', product.nombre);
  setValue('marca', product.marca);
  setValue('subcategoria', product.subcategoria);
  setValue('precio', product.precio);
  setValue('precio_original', product.precio_original);
  setValue('stock', product.stock);
  setValue('stock_flash', product.stock_flash);
  setValue('popularidad', product.popularidad);
  setValue('conectividad', product.conectividad);
  setValue('publico', product.publico);
  setValue('descripcion', product.descripcion);
  setValue('rgb', product.rgb);
  setValue('envio_gratis', product.envio_gratis);

  const hint = document.getElementById('productFotoHint');
  if (hint) hint.textContent = product.foto ? `Foto actual: ${product.foto}` : 'Este producto no tiene foto.';
  const btn = document.getElementById('productSubmitBtn');
  if (btn) btn.textContent = 'Guardar cambios';
  const cancel = document.getElementById('cancelProductEdit');
  if (cancel) cancel.hidden = false;
  const sellerField = document.getElementById('productSellerField');
  if (sellerField) sellerField.hidden = true;

  const section = form.closest('section');
  const heading = section ? section.querySelector('.panel-section-header h2') : null;
  const subheading = section ? section.querySelector('.panel-section-header p') : null;
  if (heading) heading.textContent = 'Editar producto';
  if (subheading) subheading.textContent = 'Modifica los datos del producto seleccionado.';

  form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  panelSetMessage(`Editando "${product.nombre}". Sube una imagen solo si quieres cambiarla.`, 'info');
}

function buildProductPayload(form) {
  const fd = new FormData(form);
  const payload = {
    categoria_id: Number(fd.get('categoria_id')),
    nombre: fd.get('nombre'),
    marca: fd.get('marca'),
    subcategoria: fd.get('subcategoria') || null,
    precio: Number(fd.get('precio')),
    precio_original: fd.get('precio_original') ? Number(fd.get('precio_original')) : null,
    descripcion: fd.get('descripcion'),
    stock: Number(fd.get('stock') || 0),
    stock_flash: Number(fd.get('stock_flash') || 0),
    popularidad: Number(fd.get('popularidad') || 50),
    conectividad: fd.get('conectividad') || null,
    rgb: fd.get('rgb') ? 1 : 0,
    envio_gratis: fd.get('envio_gratis') ? 1 : 0,
    publico: fd.get('publico') || 'ambos'
  };
  ['etiqueta_conexion', 'tipo_ilustracion'].forEach(name => {
    if (form.querySelector(`[name="${name}"]`)) payload[name] = fd.get(name) || null;
  });
  return payload;
}

async function createProductFromForm(event) {
  event.preventDefault();
  const form = event.target;
  const editingId = panelState.editingProductId;
  const fd = new FormData(form);
  const fileInput = form.querySelector('input[name="foto_file"]');
  let foto = null;

  try {
    if (fileInput && fileInput.files && fileInput.files[0]) {
      const uploadData = new FormData();
      uploadData.append('foto', fileInput.files[0]);
      const uploadEndpoint = `/api/panel/${panelState.role}/productos/foto`;
      const uploadRes = await fetch(uploadEndpoint, {
        method: 'POST',
        credentials: 'same-origin',
        body: uploadData
      });
      const uploadJson = await uploadRes.json().catch(() => ({}));
      if (!uploadRes.ok || !uploadJson.ok) {
        throw new Error(uploadJson.error || 'No se pudo subir la imagen');
      }
      foto = uploadJson.foto;
    }

    const payload = buildProductPayload(form);
    if (foto) payload.foto = foto;

    let endpoint = panelState.config.apiProductos;
    let method = 'POST';
    if (editingId) {
      endpoint = `${endpoint}/${editingId}`;
      method = 'PUT';
    } else {
      if (panelState.role === 'admin' && fd.get('vendedor_id')) {
        payload.vendedor_id = Number(fd.get('vendedor_id'));
      }
    }

    await panelFetch(endpoint, { method, body: JSON.stringify(payload) });
    panelSetMessage(editingId ? 'Producto actualizado correctamente.' : 'Producto creado correctamente.', 'success');
    resetProductForm();
    await loadPanelProductos();
    await loadPanelResumen();
  } catch (err) {
    panelSetMessage(err.message, 'error');
  }
}

async function loadPanelCategories() {
  const select = document.getElementById('productCategory');
  const sellerSelect = document.getElementById('productSeller');
  if (!select) return;
  try {
    const data = await panelFetch('/api/categorias');
    const categories = data.categorias || [];
    select.innerHTML = '<option value="">Selecciona categoría</option>' + categories.map(c =>
      `<option value="${c.id}">${panelEscape(c.nombre)}</option>`).join('');
  } catch (err) {
    panelSetMessage(`No se pudieron cargar categorías: ${err.message}`, 'error');
  }

  if (sellerSelect && panelState.role === 'admin') {
    try {
      const data = await panelFetch('/api/panel/admin/usuarios');
      const sellers = (data.usuarios || []).filter(c => c.rol === 'vendedor' || c.rol === 'admin');
      sellerSelect.innerHTML = '<option value="">Sin vendedor asignado</option>' + sellers.map(c =>
        `<option value="${c.id}">${panelEscape(c.nombre)} (${panelEscape(c.rol)})</option>`).join('');
    } catch (_) {}
  }
}

async function initPanelPage() {
  panelState.role = document.body.dataset.panelRole || null;
  panelState.config = panelConfig[panelState.role];
  const title = document.getElementById('panelTitle');
  const subtitle = document.getElementById('panelSubtitle');
  if (title) title.textContent = panelState.config.title;
  if (subtitle) subtitle.textContent = panelState.config.subtitle;

  try {
    const auth = await panelFetch('/api/auth/me');
    if (!auth.ok || !auth.autenticado) {
      window.location.href = 'cuenta.html';
      return;
    }
    panelState.user = auth.cliente;
    if (auth.cliente.rol !== panelState.role) {
      window.location.href = auth.cliente.rol === 'admin' ? 'admin.html' : 'cuenta.html';
      return;
    }
    const sellerField = document.getElementById('productSellerField');
    if (sellerField) sellerField.hidden = auth.cliente.rol !== 'admin';
    document.getElementById('panelUserName').textContent = auth.cliente.nombre;
    document.getElementById('panelUserBadge').textContent = panelState.role === 'admin' ? 'Administrador' : 'Vendedor';

    const productForm = document.getElementById('productForm');
    if (productForm) productForm.addEventListener('submit', createProductFromForm);
    const cancelEdit = document.getElementById('cancelProductEdit');
    if (cancelEdit) cancelEdit.addEventListener('click', () => {
      resetProductForm();
      panelSetMessage('Edición cancelada.', 'info');
    });
    resetProductForm();

    await Promise.all([
      loadPanelCategories(),
      loadPanelResumen(),
      loadPanelProductos(),
      loadPanelPedidos(),
      loadPanelUsuarios()
    ]);
    panelSetMessage('Panel cargado correctamente.', 'success');
  } catch (err) {
    panelSetMessage(`No se pudo cargar el panel: ${err.message}`, 'error');
  }
}

document.addEventListener('DOMContentLoaded', initPanelPage);
