// ==================== Funciones Principales ====================

// Inicializar aplicación
function initApp() {
    // Verificar autenticación
    if (isAuthenticated()) {
        showAdminPanel();
    } else {
        showLoginScreen();
    }
    
    // Event listeners
    setupEventListeners();
}

// Mostrar pantalla de login
function showLoginScreen() {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('adminPanel').style.display = 'none';
}

// Mostrar panel de administración
function showAdminPanel() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'flex';
    
    // Cargar datos del usuario
    const user = getCurrentUser();
    if (user) {
        document.getElementById('currentUsername').textContent = user.username;
        document.getElementById('currentUserRole').textContent = user.rol;
    }
    
    // Cargar sección actual
    loadSection(AppState.currentSection);
}

// Event listeners
function setupEventListeners() {
    // Login form
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // Logout
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    
    // Navegación
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.dataset.section;
            changeSection(section);
        });
    });
    
    // Botón añadir nuevo
    document.getElementById('addNewBtn').addEventListener('click', () => {
        openItemForm();
    });
    
    // Búsqueda
    let searchTimeout;
    document.getElementById('searchInput').addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            AppState.searchTerm = e.target.value;
            AppState.currentPage = 1;
            loadSection(AppState.currentSection);
        }, 500);
    });
    
    // Filtros
    document.getElementById('filterActivo').addEventListener('change', (e) => {
        AppState.filters.activo = e.target.value;
        AppState.currentPage = 1;
        loadSection(AppState.currentSection);
    });
    
    document.getElementById('filterExtra').addEventListener('change', (e) => {
        const config = SectionConfig[AppState.currentSection];
        if (config.filterByParent) {
            AppState.filters[config.filterByParent.field] = e.target.value;
            AppState.currentPage = 1;
            loadSection(AppState.currentSection);
        }
    });
    
    // Paginación
    document.getElementById('prevPage').addEventListener('click', () => {
        if (AppState.currentPage > 1) {
            AppState.currentPage--;
            loadSection(AppState.currentSection);
        }
    });
    
    document.getElementById('nextPage').addEventListener('click', () => {
        AppState.currentPage++;
        loadSection(AppState.currentSection);
    });
    
    // Modal forms
    document.getElementById('itemForm').addEventListener('submit', handleItemFormSubmit);
    document.getElementById('addImageForm').addEventListener('submit', handleAddImage);
    
    // Cerrar modales
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            UI.hideModal('formModal');
            UI.hideModal('imageModal');
        });
    });
    
    // Cerrar modal al hacer click fuera
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                UI.hideModal(modal.id);
            }
        });
    });
    
    // Setup image preview
    UI.setupImagePreview();
}

// Handle login
async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('loginError');
    
    errorDiv.style.display = 'none';
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Iniciando sesión...';
    
    try {
        const response = await api.login(username, password);
        
        if (response.success) {
            saveToken(response.data.token);
            saveUser(response.data.user);
            AppState.currentUser = response.data.user;
            showAdminPanel();
            UI.showToast('¡Bienvenido!', 'success');
        }
    } catch (error) {
        errorDiv.textContent = error.message || 'Error al iniciar sesión';
        errorDiv.style.display = 'block';
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Iniciar Sesión';
    }
}

// Handle logout
function handleLogout() {
    if (confirm('¿Estás seguro de cerrar sesión?')) {
        removeToken();
        removeUser();
        AppState.currentUser = null;
        showLoginScreen();
        UI.showToast('Sesión cerrada', 'info');
    }
}

// Cambiar de sección
function changeSection(section) {
    // Actualizar navegación activa
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-section="${section}"]`).classList.add('active');
    
    // Reset state
    AppState.reset();
    AppState.currentSection = section;
    
    // Cargar sección
    loadSection(section);
}

// Cargar datos de una sección
async function loadSection(section) {
    const config = SectionConfig[section];
    
    // Actualizar título
    document.getElementById('sectionTitle').textContent = config.title;
    document.getElementById('addNewText').textContent = `Nuevo ${config.singular}`;
    
    // Mostrar/ocultar botón según permisos
    const addBtn = document.getElementById('addNewBtn');
    addBtn.style.display = canEdit() ? 'flex' : 'none';
    
    // Setup filtro extra si existe
    const filterExtra = document.getElementById('filterExtra');
    if (config.filterByParent) {
        filterExtra.style.display = 'block';
        filterExtra.innerHTML = `<option value="">Todos (${config.filterByParent.label})</option>`;
        await UI.loadSelectOptions(config.filterByParent.source, 'filterExtra');
    } else {
        filterExtra.style.display = 'none';
    }
    
    // Mostrar loading
    document.getElementById('dataTable').innerHTML = `
        <div class="loading">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Cargando datos...</p>
        </div>
    `;
    
    // Construir parámetros
    const params = {
        page: AppState.currentPage,
        limit: AppState.itemsPerPage,
        ...AppState.filters
    };
    
    if (AppState.searchTerm) {
        params.search = AppState.searchTerm;
    }
    
    try {
        const response = await api.getAll(section, params);
        
        // Obtener el array de datos (puede estar en diferentes keys)
        const dataKey = Object.keys(response.data).find(key => Array.isArray(response.data[key]));
        const items = response.data[dataKey] || [];
        const pagination = response.data.pagination;
        
        // Renderizar tabla
        UI.renderTable(section, items);
        
        // Actualizar paginación
        if (pagination) {
            document.getElementById('pagination').style.display = 'flex';
            document.getElementById('pageInfo').textContent = 
                `Página ${pagination.page} de ${pagination.pages} (${pagination.total} registros)`;
            document.getElementById('prevPage').disabled = pagination.page === 1;
            document.getElementById('nextPage').disabled = pagination.page === pagination.pages;
        } else {
            document.getElementById('pagination').style.display = 'none';
        }
        
    } catch (error) {
        document.getElementById('dataTable').innerHTML = `
            <div class="loading">
                <i class="fas fa-exclamation-circle"></i>
                <p>Error al cargar datos: ${error.message}</p>
            </div>
        `;
    }
}

// Abrir formulario para crear/editar
async function openItemForm(item = null) {
    const config = SectionConfig[AppState.currentSection];
    
    document.getElementById('modalTitle').textContent = 
        item ? `Editar ${config.singular}` : `Nuevo ${config.singular}`;
    
    AppState.editingItem = item;
    
    UI.renderForm(AppState.currentSection, item);
    UI.showModal('formModal');
}

// Editar item
async function editItem(section, id) {
    try {
        const response = await api.getById(section, id);
        openItemForm(response.data);
    } catch (error) {
        UI.showToast('Error al cargar datos: ' + error.message, 'error');
    }
}

// Eliminar item
async function deleteItem(section, id) {
    if (!confirm('¿Estás seguro de eliminar este elemento?')) return;
    
    try {
        await api.delete(section, id);
        UI.showToast('Eliminado exitosamente', 'success');
        loadSection(section);
    } catch (error) {
        UI.showToast('Error al eliminar: ' + error.message, 'error');
    }
}

// Manejar submit del formulario
async function handleItemFormSubmit(e) {
    e.preventDefault();
    
    const config = SectionConfig[AppState.currentSection];
    const formData = {};
    
    // Recopilar datos del formulario
    config.fields.forEach(field => {
        const input = document.getElementById(`field_${field.name}`);
        if (!input) return;
        
        if (field.type === 'checkbox') {
            formData[field.name] = input.checked;
        } else if (field.type === 'number') {
            formData[field.name] = input.value ? parseFloat(input.value) : null;
        } else {
            formData[field.name] = input.value;
        }
    });
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
    
    try {
        if (AppState.editingItem) {
            const id = AppState.editingItem[config.idField];
            await api.update(AppState.currentSection, id, formData);
            UI.showToast('Actualizado exitosamente', 'success');
        } else {
            await api.create(AppState.currentSection, formData);
            UI.showToast('Creado exitosamente', 'success');
        }
        
        UI.hideModal('formModal');
        loadSection(AppState.currentSection);
        
    } catch (error) {
        UI.showToast('Error: ' + error.message, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Guardar';
    }
}

// Manejar agregar imagen
async function handleAddImage(e) {
    e.preventDefault();
    
    const imageData = {
        url: document.getElementById('imageUrl').value,
        alt_text: document.getElementById('imageAlt').value,
        orden: parseInt(document.getElementById('imageOrden').value) || 0,
        es_principal: document.getElementById('imageEsPrincipal').checked,
        tipo_entidad: AppState.currentEntity.type,
        id_entidad: AppState.currentEntity.id,
        activo: true
    };
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Agregando...';
    
    try {
        await api.createImage(imageData);
        UI.showToast('Imagen agregada exitosamente', 'success');
        
        // Limpiar formulario
        e.target.reset();
        document.getElementById('imagePreview').style.display = 'none';
        
        // Recargar imágenes
        UI.loadEntityImages();
        
    } catch (error) {
        UI.showToast('Error al agregar imagen: ' + error.message, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-plus"></i> Agregar Imagen';
    }
}

// ==================== Iniciar Aplicación ====================

document.addEventListener('DOMContentLoaded', initApp);
