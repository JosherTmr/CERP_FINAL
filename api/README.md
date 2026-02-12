# API REST - Sistema de Turismo de Lujo

API REST completa para gestión de destinos turísticos de lujo, construida con PHP y MySQL.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Estructura de Archivos](#estructura-de-archivos)
- [Endpoints](#endpoints)
- [Autenticación](#autenticación)
- [Ejemplos de Uso](#ejemplos-de-uso)
- [Solución de Problemas](#solución-de-problemas)

## ✨ Características

- ✅ CRUD completo para todas las entidades
- ✅ Autenticación con JWT
- ✅ Sistema de roles (admin, editor, viewer)
- ✅ Paginación en todas las listas
- ✅ Filtros y búsqueda
- ✅ Soft delete (no elimina datos realmente)
- ✅ Validación de datos
- ✅ CORS configurado
- ✅ Relaciones polimórficas (imágenes)

## 📦 Requisitos

- PHP >= 7.4
- MySQL >= 5.7 o MariaDB >= 10.2
- Extensiones PHP:
  - PDO
  - pdo_mysql
  - json
- Apache con mod_rewrite (o Nginx)

## 🚀 Instalación

### Paso 1: Subir Archivos al Servidor

Sube la carpeta `API` completa a tu hosting. La estructura debe quedar así:

```
tu-dominio.com/
├── public_html/
│   ├── API/
│   │   ├── .htaccess
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── utils/
│   │   ├── auth/
│   │   └── endpoints/
│   └── tu-sitio-react/
```

### Paso 2: Crear la Base de Datos

1. Accede a phpMyAdmin en tu hosting
2. Crea una nueva base de datos llamada `turismo_lujo_db`
3. Ejecuta el archivo `01_tabla_usuarios.sql` para crear las tablas
4. Ejecuta el SQL del esquema de base de datos que ya tienes

### Paso 3: Configurar Credenciales

Edita el archivo `config/database.php` y actualiza las credenciales:

```php
private $host = "localhost";              // Host de tu DB
private $db_name = "turismo_lujo_db";    // Nombre de tu DB
private $username = "tu_usuario_mysql";   // Usuario de MySQL
private $password = "tu_password_mysql";  // Contraseña de MySQL
```

### Paso 4: Configurar JWT

Edita el archivo `config/jwt.php` y cambia el secreto:

```php
// Genera un secreto seguro usando:
// php -r "echo base64_encode(random_bytes(32));"
define('JWT_SECRET', 'TU_SECRETO_SEGURO_AQUI');
```

### Paso 5: Verificar Permisos

Asegúrate de que los archivos tienen los permisos correctos:
- Archivos: 644
- Directorios: 755

## ⚙️ Configuración

### Configuración de CORS en React

En tu aplicación React, configura la URL base de la API:

```javascript
// api.js
const API_BASE_URL = 'https://tu-dominio.com/API';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## 📁 Estructura de Archivos

```
API/
├── .htaccess                    # Configuración de Apache
├── config/
│   ├── database.php            # Configuración de base de datos
│   └── jwt.php                 # Configuración de JWT
├── middleware/
│   └── auth.php                # Middleware de autenticación
├── utils/
│   └── helpers.php             # Funciones auxiliares
├── auth/
│   └── login.php               # Endpoint de login
├── endpoints/
│   ├── destinos/
│   │   └── index.php           # CRUD de destinos
│   ├── subdestinos/
│   │   └── index.php           # CRUD de subdestinos
│   ├── servicios/
│   │   └── index.php           # CRUD de servicios
│   ├── paquetes/
│   │   └── index.php           # CRUD de paquetes
│   ├── imagenes/
│   │   └── index.php           # CRUD de imágenes
│   └── users/
│       └── index.php           # CRUD de usuarios
└── README.md                    # Este archivo
```

## 🔌 Endpoints

### Autenticación

#### Login
```
POST /API/auth/login.php
Body: {
  "username": "admin",
  "password": "Admin123!"
}
Response: {
  "success": true,
  "data": {
    "token": "eyJ...",
    "user": { ... },
    "expires_in": 86400
  }
}
```

### Destinos

```
GET    /API/endpoints/destinos/index.php              # Listar todos
GET    /API/endpoints/destinos/index.php/1            # Obtener por ID
POST   /API/endpoints/destinos/index.php              # Crear nuevo
PUT    /API/endpoints/destinos/index.php/1            # Actualizar
DELETE /API/endpoints/destinos/index.php/1            # Eliminar (soft)
```

#### Parámetros de Query (GET)
- `page` - Número de página (default: 1)
- `limit` - Resultados por página (default: 10, max: 100)
- `activo` - Filtrar por estado (0 o 1)
- `search` - Búsqueda en nombre, país y descripción

### Subdestinos

```
GET    /API/endpoints/subdestinos/index.php           # Listar todos
GET    /API/endpoints/subdestinos/index.php/1         # Obtener por ID
POST   /API/endpoints/subdestinos/index.php           # Crear nuevo
PUT    /API/endpoints/subdestinos/index.php/1         # Actualizar
DELETE /API/endpoints/subdestinos/index.php/1         # Eliminar
```

#### Parámetros adicionales (GET)
- `id_destino` - Filtrar por destino

### Servicios

```
GET    /API/endpoints/servicios/index.php             # Listar todos
GET    /API/endpoints/servicios/index.php/1           # Obtener por ID
POST   /API/endpoints/servicios/index.php             # Crear nuevo
PUT    /API/endpoints/servicios/index.php/1           # Actualizar
DELETE /API/endpoints/servicios/index.php/1           # Eliminar
```

#### Parámetros adicionales (GET)
- `id_subdestino` - Filtrar por subdestino
- `tipo` - Filtrar por tipo de servicio

### Paquetes

```
GET    /API/endpoints/paquetes/index.php              # Listar todos
GET    /API/endpoints/paquetes/index.php/1            # Obtener por ID
POST   /API/endpoints/paquetes/index.php              # Crear nuevo
PUT    /API/endpoints/paquetes/index.php/1            # Actualizar
DELETE /API/endpoints/paquetes/index.php/1            # Eliminar
```

### Imágenes

```
GET    /API/endpoints/imagenes/index.php              # Listar todas
GET    /API/endpoints/imagenes/index.php/1            # Obtener por ID
POST   /API/endpoints/imagenes/index.php              # Crear nueva
PUT    /API/endpoints/imagenes/index.php/1            # Actualizar
DELETE /API/endpoints/imagenes/index.php/1            # Eliminar
```

#### Parámetros adicionales (GET)
- `tipo_entidad` - Filtrar por tipo (DESTINO, SUBDESTINO, SERVICIO, PAQUETE)
- `id_entidad` - Filtrar por ID de entidad

### Usuarios

```
GET    /API/endpoints/users/index.php                 # Listar todos (solo admin)
GET    /API/endpoints/users/index.php/1               # Obtener por ID
POST   /API/endpoints/users/index.php                 # Crear nuevo (solo admin)
PUT    /API/endpoints/users/index.php/1               # Actualizar
DELETE /API/endpoints/users/index.php/1               # Eliminar (solo admin)
```

## 🔐 Autenticación

Todos los endpoints excepto el login requieren autenticación mediante JWT.

### Incluir el Token en las Peticiones

```javascript
// Ejemplo con fetch
fetch('https://tu-dominio.com/API/endpoints/destinos/index.php', {
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  }
})

// Ejemplo con axios
axios.get('/destinos', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

### Roles y Permisos

- **admin**: Acceso completo a todo
- **editor**: Puede crear y editar (no eliminar)
- **viewer**: Solo puede ver (GET)

## 📝 Ejemplos de Uso

### Ejemplo 1: Crear un Destino

```javascript
const crearDestino = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch('https://tu-dominio.com/API/endpoints/destinos/index.php', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nombre: 'Cartagena de Indias',
      pais: 'Colombia',
      descripcion: 'Ciudad amurallada con encanto colonial',
      activo: true
    })
  });
  
  const data = await response.json();
  console.log(data);
};
```

### Ejemplo 2: Crear un Paquete con Servicios

```javascript
const crearPaquete = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch('https://tu-dominio.com/API/endpoints/paquetes/index.php', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nombre: 'Tour Premium Cartagena',
      descripcion: 'Experiencia completa por la ciudad',
      duracion_horas: 8,
      capacidad_maxima: 10,
      id_subdestino: 1,
      servicios: [
        {
          id_servicio: 1,
          es_opcional: false,
          costo_adicional: 0,
          cantidad_incluida: 1
        },
        {
          id_servicio: 2,
          es_opcional: true,
          costo_adicional: 50.00,
          cantidad_incluida: 1
        }
      ]
    })
  });
  
  const data = await response.json();
  console.log(data);
};
```

### Ejemplo 3: Agregar Imagen

```javascript
const agregarImagen = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch('https://tu-dominio.com/API/endpoints/imagenes/index.php', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      url: 'https://ejemplo.com/imagen.jpg',
      alt_text: 'Vista de Cartagena',
      orden: 1,
      tipo_entidad: 'DESTINO',
      id_entidad: 1,
      es_principal: true,
      activo: true
    })
  });
  
  const data = await response.json();
  console.log(data);
};
```

## 🐛 Solución de Problemas

### Error: "Database connection error"

**Causa**: Credenciales incorrectas en `config/database.php`

**Solución**: Verifica los datos de conexión en phpMyAdmin de tu hosting

### Error: "No token provided"

**Causa**: No se está enviando el token de autenticación

**Solución**: Asegúrate de incluir el header `Authorization: Bearer TOKEN`

### Error: "Invalid token"

**Causa**: El token ha expirado o es inválido

**Solución**: Vuelve a hacer login para obtener un nuevo token

### Error 405: "Method not allowed"

**Causa**: Estás usando un método HTTP incorrecto

**Solución**: Verifica que estés usando el método correcto (GET, POST, PUT, DELETE)

### Error 404: "Not Found"

**Causa**: La ruta del endpoint es incorrecta

**Solución**: Verifica que la URL esté correcta, incluyendo `/index.php` al final

### Error: "CORS policy"

**Causa**: El servidor no está permitiendo peticiones desde tu dominio de React

**Solución**: Verifica que el archivo `.htaccess` esté en la carpeta API

## 🔒 Seguridad

### Recomendaciones Importantes

1. **Cambia las credenciales por defecto**
   - Usuario admin por defecto: `admin` / `Admin123!`
   - Cámbialo inmediatamente después de la instalación

2. **Genera un JWT_SECRET seguro**
   ```bash
   php -r "echo base64_encode(random_bytes(32));"
   ```

3. **Usa HTTPS en producción**
   - Nunca uses HTTP para la API en producción
   - Activa SSL/TLS en tu hosting

4. **Protege archivos sensibles**
   - Los archivos en `config/` están protegidos por `.htaccess`
   - No compartas tu `JWT_SECRET`

5. **Mantén backups regulares**
   - Haz backup de la base de datos regularmente
   - Guarda backups de los archivos de configuración

## 📞 Soporte

Si tienes problemas:
1. Revisa la sección de [Solución de Problemas](#solución-de-problemas)
2. Verifica los logs de error de PHP en tu hosting
3. Revisa la consola del navegador para errores de JavaScript

## 📄 Licencia

Este proyecto es de uso privado para el sistema de Turismo de Lujo.

---

**Versión**: 1.0.0  
**Última actualización**: Febrero 2026
