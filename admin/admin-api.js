// ==================== API Client ====================

class APIClient {
    constructor() {
        this.baseURL = API_CONFIG.baseURL;
    }

    // Método para hacer peticiones HTTP
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        // Agregar token si existe
        const token = getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config = {
            ...options,
            headers
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `Error ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Login
    async login(username, password) {
        return this.request(API_CONFIG.endpoints.login, {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
    }

    // GET: Obtener todos
    async getAll(section, params = {}) {
        const config = SectionConfig[section];
        const queryString = new URLSearchParams(params).toString();
        const endpoint = `${config.endpoint}${queryString ? '?' + queryString : ''}`;
        return this.request(endpoint);
    }

    // GET: Obtener por ID
    async getById(section, id) {
        const config = SectionConfig[section];
        return this.request(`${config.endpoint}/${id}`);
    }

    // POST: Crear
    async create(section, data) {
        const config = SectionConfig[section];
        return this.request(config.endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    // PUT: Actualizar
    async update(section, id, data) {
        const config = SectionConfig[section];
        return this.request(`${config.endpoint}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    // DELETE: Eliminar
    async delete(section, id) {
        const config = SectionConfig[section];
        return this.request(`${config.endpoint}/${id}`, {
            method: 'DELETE'
        });
    }

    // Obtener imágenes de una entidad
    async getImages(tipoEntidad, idEntidad) {
        const params = new URLSearchParams({
            tipo_entidad: tipoEntidad,
            id_entidad: idEntidad,
            activo: 1
        });
        return this.request(`${API_CONFIG.endpoints.imagenes}?${params}`);
    }

    // Crear imagen
    async createImage(imageData) {
        return this.request(API_CONFIG.endpoints.imagenes, {
            method: 'POST',
            body: JSON.stringify(imageData)
        });
    }

    // Actualizar imagen
    async updateImage(id, imageData) {
        return this.request(`${API_CONFIG.endpoints.imagenes}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(imageData)
        });
    }

    // Eliminar imagen
    async deleteImage(id) {
        return this.request(`${API_CONFIG.endpoints.imagenes}/${id}`, {
            method: 'DELETE'
        });
    }
}

// Instancia global del cliente API
const api = new APIClient();
