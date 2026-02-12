# Guía de Integración React - API Turismo de Lujo

Esta guía te ayudará a integrar la API con tu aplicación React.

## 📦 Instalación de Dependencias

```bash
npm install axios
# o
yarn add axios
```

## 🔧 Configuración Inicial

### 1. Crear archivo de configuración de la API

Crea un archivo `src/services/api.js`:

```javascript
import axios from 'axios';

// URL base de tu API
const API_BASE_URL = 'https://tu-dominio.com/API';

// Crear instancia de axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar el token automáticamente
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

## 🔐 Servicio de Autenticación

Crea `src/services/auth.service.js`:

```javascript
import apiClient from './api';

export const authService = {
  // Login
  login: async (username, password) => {
    try {
      const response = await apiClient.post('/auth/login.php', {
        username,
        password
      });
      
      if (response.data.success) {
        // Guardar token y datos del usuario
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        return response.data.data;
      }
    } catch (error) {
      throw error.response?.data?.error || 'Error en el login';
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Obtener usuario actual
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Verificar si está autenticado
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};
```

## 📍 Servicios para cada Entidad

### Destinos Service

Crea `src/services/destinos.service.js`:

```javascript
import apiClient from './api';

export const destinosService = {
  // Obtener todos los destinos
  getAll: async (params = {}) => {
    try {
      const response = await apiClient.get('/endpoints/destinos/index.php', { params });
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error al obtener destinos';
    }
  },

  // Obtener un destino por ID
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/endpoints/destinos/index.php/${id}`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error al obtener destino';
    }
  },

  // Crear destino
  create: async (destino) => {
    try {
      const response = await apiClient.post('/endpoints/destinos/index.php', destino);
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error al crear destino';
    }
  },

  // Actualizar destino
  update: async (id, destino) => {
    try {
      const response = await apiClient.put(`/endpoints/destinos/index.php/${id}`, destino);
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error al actualizar destino';
    }
  },

  // Eliminar destino
  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/endpoints/destinos/index.php/${id}`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error al eliminar destino';
    }
  }
};
```

### Subdestinos Service

```javascript
// src/services/subdestinos.service.js
import apiClient from './api';

export const subdestinosService = {
  getAll: (params) => apiClient.get('/endpoints/subdestinos/index.php', { params }),
  getById: (id) => apiClient.get(`/endpoints/subdestinos/index.php/${id}`),
  create: (data) => apiClient.post('/endpoints/subdestinos/index.php', data),
  update: (id, data) => apiClient.put(`/endpoints/subdestinos/index.php/${id}`, data),
  delete: (id) => apiClient.delete(`/endpoints/subdestinos/index.php/${id}`)
};
```

### Servicios Service

```javascript
// src/services/servicios.service.js
import apiClient from './api';

export const serviciosService = {
  getAll: (params) => apiClient.get('/endpoints/servicios/index.php', { params }),
  getById: (id) => apiClient.get(`/endpoints/servicios/index.php/${id}`),
  create: (data) => apiClient.post('/endpoints/servicios/index.php', data),
  update: (id, data) => apiClient.put(`/endpoints/servicios/index.php/${id}`, data),
  delete: (id) => apiClient.delete(`/endpoints/servicios/index.php/${id}`)
};
```

## 🎯 Ejemplos de Uso en Componentes React

### Componente de Login

```javascript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authService.login(username, password);
      console.log('Login exitoso:', data);
      navigate('/dashboard');
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </form>
    </div>
  );
}

export default Login;
```

### Componente de Lista de Destinos

```javascript
import React, { useState, useEffect } from 'react';
import { destinosService } from '../services/destinos.service';

function DestinosList() {
  const [destinos, setDestinos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchDestinos();
  }, [page]);

  const fetchDestinos = async () => {
    try {
      setLoading(true);
      const data = await destinosService.getAll({ 
        page, 
        limit: 10,
        activo: 1 
      });
      setDestinos(data.destinos);
      setPagination(data.pagination);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este destino?')) {
      try {
        await destinosService.delete(id);
        fetchDestinos(); // Recargar lista
      } catch (err) {
        alert('Error al eliminar: ' + err);
      }
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="destinos-list">
      <h2>Destinos Turísticos</h2>
      
      <div className="grid">
        {destinos.map((destino) => (
          <div key={destino.id_destino} className="card">
            <h3>{destino.nombre}</h3>
            <p>{destino.pais}</p>
            <p>{destino.descripcion}</p>
            <button onClick={() => handleDelete(destino.id_destino)}>
              Eliminar
            </button>
          </div>
        ))}
      </div>

      {pagination && (
        <div className="pagination">
          <button 
            onClick={() => setPage(page - 1)} 
            disabled={page === 1}
          >
            Anterior
          </button>
          <span>Página {page} de {pagination.pages}</span>
          <button 
            onClick={() => setPage(page + 1)} 
            disabled={page === pagination.pages}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}

export default DestinosList;
```

### Componente de Formulario de Destino

```javascript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { destinosService } from '../services/destinos.service';

function DestinoForm() {
  const [formData, setFormData] = useState({
    nombre: '',
    pais: '',
    descripcion: '',
    activo: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await destinosService.create(formData);
      alert('Destino creado exitosamente');
      navigate('/destinos');
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="destino-form">
      <h2>Nuevo Destino</h2>
      
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>País:</label>
          <input
            type="text"
            name="pais"
            value={formData.pais}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Descripción:</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              name="activo"
              checked={formData.activo}
              onChange={handleChange}
            />
            Activo
          </label>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar Destino'}
        </button>
      </form>
    </div>
  );
}

export default DestinoForm;
```

### Hook Personalizado para Datos

```javascript
// src/hooks/useDestinos.js
import { useState, useEffect } from 'react';
import { destinosService } from '../services/destinos.service';

export const useDestinos = (params = {}) => {
  const [destinos, setDestinos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchDestinos();
  }, [JSON.stringify(params)]);

  const fetchDestinos = async () => {
    try {
      setLoading(true);
      const data = await destinosService.getAll(params);
      setDestinos(data.destinos);
      setPagination(data.pagination);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => fetchDestinos();

  return { destinos, loading, error, pagination, refresh };
};

// Uso:
// const { destinos, loading, error, refresh } = useDestinos({ page: 1, limit: 10 });
```

## 🛡️ Protección de Rutas

```javascript
// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../services/auth.service';

function ProtectedRoute({ children, requiredRole }) {
  const isAuth = authService.isAuthenticated();
  const user = authService.getCurrentUser();

  if (!isAuth) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user?.rol !== requiredRole) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
}

export default ProtectedRoute;

// Uso en App.js:
// <Route 
//   path="/admin" 
//   element={
//     <ProtectedRoute requiredRole="admin">
//       <AdminPanel />
//     </ProtectedRoute>
//   } 
// />
```

## 🎨 Context API para Estado Global

```javascript
// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth.service';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const data = await authService.login(username, password);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.rol === 'admin'
  };

  if (loading) return <div>Cargando...</div>;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Uso en App.js:
// <AuthProvider>
//   <App />
// </AuthProvider>
```

## 📱 Manejo de Errores Global

```javascript
// src/utils/errorHandler.js
export const handleApiError = (error) => {
  if (error.response) {
    // Error de respuesta del servidor
    return error.response.data?.error || 'Error del servidor';
  } else if (error.request) {
    // No se recibió respuesta
    return 'No se pudo conectar con el servidor';
  } else {
    // Error en la configuración de la petición
    return error.message;
  }
};
```

## 🔍 Tips y Mejores Prácticas

1. **Centraliza los servicios**: Mantén todos los servicios en la carpeta `src/services`

2. **Usa hooks personalizados**: Crea hooks reutilizables para operaciones comunes

3. **Maneja errores apropiadamente**: Siempre muestra mensajes de error claros al usuario

4. **Implementa loading states**: Muestra indicadores de carga mientras se hacen peticiones

5. **Caché inteligente**: Considera usar React Query o SWR para caché y sincronización

6. **Valida en el frontend**: Valida datos antes de enviarlos a la API

7. **Seguridad**: Nunca expongas el token en URLs o logs

---

¡Listo! Con estas herramientas tienes todo lo necesario para integrar tu API con React.
