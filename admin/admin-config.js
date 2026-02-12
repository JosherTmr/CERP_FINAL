// ==================== Configuración de la API ====================

// IMPORTANTE: Cambia esta URL por la URL de tu API
const API_CONFIG = {
    baseURL: 'https://www.cartagenaentertainmentrentandpleasure.com/api',  // ← CAMBIAR AQUÍ
    endpoints: {
        login: '/auth/login.php',
        destinos: '/endpoints/destinos/index.php',
        subdestinos: '/endpoints/subdestinos/index.php',
        servicios: '/endpoints/servicios/index.php',
        paquetes: '/endpoints/paquetes/index.php',
        imagenes: '/endpoints/imagenes/index.php',
        users: '/endpoints/users/index.php'
    }
};

// Para desarrollo local, usa:
// const API_CONFIG = {
//     baseURL: 'http://localhost/API',
//     ...
// };

// ==================== Estado Global de la Aplicación ====================

const AppState = {
    currentSection: 'destinos',
    currentPage: 1,
    itemsPerPage: 10,
    searchTerm: '',
    filters: {},
    currentUser: null,
    token: null,
    editingItem: null,
    currentEntity: null, // Para gestión de imágenes

    reset() {
        this.currentPage = 1;
        this.searchTerm = '';
        this.filters = {};
    }
};

// ==================== Configuración de Secciones ====================

const SectionConfig = {
    destinos: {
        title: 'Destinos',
        singular: 'Destino',
        icon: 'fa-map-marked-alt',
        endpoint: API_CONFIG.endpoints.destinos,
        fields: [
            { name: 'nombre', label: 'Nombre', type: 'text', required: true },
            { name: 'pais', label: 'País', type: 'text', required: true },
            { name: 'descripcion', label: 'Descripción', type: 'textarea', required: true },
            { name: 'activo', label: 'Activo', type: 'checkbox', default: true }
        ],
        tableColumns: [
            { key: 'id_destino', label: 'ID' },
            { key: 'nombre', label: 'Nombre' },
            { key: 'pais', label: 'País' },
            { key: 'activo', label: 'Estado', type: 'status' },
            { key: 'actions', label: 'Acciones', type: 'actions' }
        ],
        idField: 'id_destino',
        supportsImages: true,
        imageEntity: 'DESTINO'
    },

    subdestinos: {
        title: 'Subdestinos',
        singular: 'Subdestino',
        icon: 'fa-map-pin',
        endpoint: API_CONFIG.endpoints.subdestinos,
        fields: [
            { name: 'nombre', label: 'Nombre', type: 'text', required: true },
            { name: 'id_destino', label: 'Destino', type: 'select', required: true, source: 'destinos' },
            { name: 'descripcion', label: 'Descripción', type: 'textarea' },
            { name: 'latitud', label: 'Latitud', type: 'number', step: 'any', required: true },
            { name: 'longitud', label: 'Longitud', type: 'number', step: 'any', required: true },
            { name: 'activo', label: 'Activo', type: 'checkbox', default: true }
        ],
        tableColumns: [
            { key: 'id_subdestino', label: 'ID' },
            { key: 'nombre', label: 'Nombre' },
            { key: 'destino_nombre', label: 'Destino' },
            { key: 'activo', label: 'Estado', type: 'status' },
            { key: 'actions', label: 'Acciones', type: 'actions' }
        ],
        idField: 'id_subdestino',
        filterByParent: { field: 'id_destino', label: 'Filtrar por Destino', source: 'destinos' },
        supportsImages: true,
        imageEntity: 'SUBDESTINO'
    },

    servicios: {
        title: 'Servicios',
        singular: 'Servicio',
        icon: 'fa-concierge-bell',
        endpoint: API_CONFIG.endpoints.servicios,
        fields: [
            { name: 'nombre', label: 'Nombre', type: 'text', required: true },
            { name: 'tipo', label: 'Tipo', type: 'text', required: true, placeholder: 'Ej: hospedaje, transporte, actividad' },
            { name: 'id_subdestino', label: 'Subdestino', type: 'select', required: true, source: 'subdestinos' },
            { name: 'descripcion', label: 'Descripción', type: 'textarea' },
            { name: 'disponible_independiente', label: 'Disponible Independiente', type: 'checkbox', default: true },
            { name: 'activo', label: 'Activo', type: 'checkbox', default: true }
        ],
        tableColumns: [
            { key: 'id_servicio', label: 'ID' },
            { key: 'nombre', label: 'Nombre' },
            { key: 'tipo', label: 'Tipo' },
            { key: 'subdestino_nombre', label: 'Subdestino' },
            { key: 'activo', label: 'Estado', type: 'status' },
            { key: 'actions', label: 'Acciones', type: 'actions' }
        ],
        idField: 'id_servicio',
        filterByParent: { field: 'id_subdestino', label: 'Filtrar por Subdestino', source: 'subdestinos' },
        supportsImages: true,
        imageEntity: 'SERVICIO'
    },

    paquetes: {
        title: 'Paquetes',
        singular: 'Paquete',
        icon: 'fa-box-open',
        endpoint: API_CONFIG.endpoints.paquetes,
        fields: [
            { name: 'nombre', label: 'Nombre', type: 'text', required: true },
            { name: 'id_subdestino', label: 'Subdestino', type: 'select', required: true, source: 'subdestinos' },
            { name: 'descripcion', label: 'Descripción', type: 'textarea', required: true },
            { name: 'duracion_horas', label: 'Duración (horas)', type: 'number', required: true },
            { name: 'capacidad_maxima', label: 'Capacidad Máxima', type: 'number', required: true },
            { name: 'activo', label: 'Activo', type: 'checkbox', default: true }
        ],
        tableColumns: [
            { key: 'id_paquete', label: 'ID' },
            { key: 'nombre', label: 'Nombre' },
            { key: 'subdestino_nombre', label: 'Subdestino' },
            { key: 'duracion_horas', label: 'Duración (hrs)' },
            { key: 'capacidad_maxima', label: 'Capacidad' },
            { key: 'activo', label: 'Estado', type: 'status' },
            { key: 'actions', label: 'Acciones', type: 'actions' }
        ],
        idField: 'id_paquete',
        filterByParent: { field: 'id_subdestino', label: 'Filtrar por Subdestino', source: 'subdestinos' },
        supportsImages: true,
        imageEntity: 'PAQUETE'
    },

    imagenes: {
        title: 'Galería de Imágenes',
        singular: 'Imagen',
        icon: 'fa-images',
        endpoint: API_CONFIG.endpoints.imagenes,
        fields: [
            { name: 'url', label: 'URL de Imagen', type: 'url', required: true },
            {
                name: 'tipo_entidad', label: 'Tipo de Entidad', type: 'select', required: true,
                options: [
                    { value: 'DESTINO', label: 'Destino' },
                    { value: 'SUBDESTINO', label: 'Subdestino' },
                    { value: 'SERVICIO', label: 'Servicio' },
                    { value: 'PAQUETE', label: 'Paquete' }
                ]
            },
            { name: 'id_entidad', label: 'ID de Entidad', type: 'number', required: true },
            { name: 'alt_text', label: 'Texto Alternativo', type: 'text' },
            { name: 'orden', label: 'Orden', type: 'number', default: 0 },
            { name: 'es_principal', label: 'Imagen Principal', type: 'checkbox', default: false },
            { name: 'activo', label: 'Activo', type: 'checkbox', default: true }
        ],
        tableColumns: [
            { key: 'id_imagen', label: 'ID' },
            { key: 'url', label: 'Vista Previa', type: 'image' },
            { key: 'tipo_entidad', label: 'Tipo' },
            { key: 'id_entidad', label: 'ID Entidad' },
            { key: 'es_principal', label: 'Principal', type: 'boolean' },
            { key: 'activo', label: 'Estado', type: 'status' },
            { key: 'actions', label: 'Acciones', type: 'actions' }
        ],
        idField: 'id_imagen',
        supportsImages: false
    },

    usuarios: {
        title: 'Usuarios',
        singular: 'Usuario',
        icon: 'fa-users',
        endpoint: API_CONFIG.endpoints.users,
        fields: [
            { name: 'username', label: 'Usuario', type: 'text', required: true },
            { name: 'email', label: 'Email', type: 'email', required: true },
            { name: 'password', label: 'Contraseña', type: 'password', required: true, hideOnEdit: true },
            { name: 'nombre_completo', label: 'Nombre Completo', type: 'text' },
            {
                name: 'rol', label: 'Rol', type: 'select', required: true,
                options: [
                    { value: 'admin', label: 'Administrador' },
                    { value: 'editor', label: 'Editor' },
                    { value: 'viewer', label: 'Visualizador' }
                ]
            },
            { name: 'activo', label: 'Activo', type: 'checkbox', default: true }
        ],
        tableColumns: [
            { key: 'id', label: 'ID' },
            { key: 'username', label: 'Usuario' },
            { key: 'email', label: 'Email' },
            { key: 'nombre_completo', label: 'Nombre' },
            { key: 'rol', label: 'Rol', type: 'badge' },
            { key: 'activo', label: 'Estado', type: 'status' },
            { key: 'actions', label: 'Acciones', type: 'actions' }
        ],
        idField: 'id',
        supportsImages: false,
        requiresAdmin: true
    }
};

// ==================== Utilidades ====================

// Obtener token del localStorage
function getToken() {
    return localStorage.getItem('authToken');
}

// Guardar token en localStorage
function saveToken(token) {
    localStorage.setItem('authToken', token);
}

// Remover token del localStorage
function removeToken() {
    localStorage.removeItem('authToken');
}

// Guardar usuario en localStorage
function saveUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

// Obtener usuario del localStorage
function getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
}

// Remover usuario del localStorage
function removeUser() {
    localStorage.removeItem('currentUser');
}

// Verificar si está autenticado
function isAuthenticated() {
    return !!getToken();
}

// Verificar si es admin
function isAdmin() {
    const user = getCurrentUser();
    return user && user.rol === 'admin';
}

// Verificar si puede editar
function canEdit() {
    const user = getCurrentUser();
    return user && (user.rol === 'admin' || user.rol === 'editor');
}
