# Referencia Rápida de API - Turismo de Lujo

## 🚀 URLs Base

```
Producción: https://tu-dominio.com/API
Local:      http://localhost/API
```

## 🔑 Credenciales por Defecto

```
Usuario: admin
Password: Admin123!
```
⚠️ **CAMBIAR INMEDIATAMENTE DESPUÉS DE LA INSTALACIÓN**

## 📍 Endpoints Rápidos

### Autenticación
```http
POST /auth/login.php
Body: { "username": "admin", "password": "Admin123!" }
```

### Destinos
```http
GET    /endpoints/destinos/index.php
GET    /endpoints/destinos/index.php/1
POST   /endpoints/destinos/index.php
PUT    /endpoints/destinos/index.php/1
DELETE /endpoints/destinos/index.php/1
```

### Subdestinos
```http
GET    /endpoints/subdestinos/index.php
GET    /endpoints/subdestinos/index.php/1
POST   /endpoints/subdestinos/index.php
PUT    /endpoints/subdestinos/index.php/1
DELETE /endpoints/subdestinos/index.php/1
```

### Servicios
```http
GET    /endpoints/servicios/index.php
GET    /endpoints/servicios/index.php/1
POST   /endpoints/servicios/index.php
PUT    /endpoints/servicios/index.php/1
DELETE /endpoints/servicios/index.php/1
```

### Paquetes
```http
GET    /endpoints/paquetes/index.php
GET    /endpoints/paquetes/index.php/1
POST   /endpoints/paquetes/index.php
PUT    /endpoints/paquetes/index.php/1
DELETE /endpoints/paquetes/index.php/1
```

### Imágenes
```http
GET    /endpoints/imagenes/index.php
GET    /endpoints/imagenes/index.php/1
POST   /endpoints/imagenes/index.php
PUT    /endpoints/imagenes/index.php/1
DELETE /endpoints/imagenes/index.php/1
```

### Usuarios
```http
GET    /endpoints/users/index.php        (solo admin)
GET    /endpoints/users/index.php/1
POST   /endpoints/users/index.php        (solo admin)
PUT    /endpoints/users/index.php/1
DELETE /endpoints/users/index.php/1      (solo admin)
```

## 📋 Parámetros de Query Comunes

```
?page=1              # Número de página
?limit=10            # Resultados por página
?activo=1            # Filtrar por estado activo
?search=texto        # Búsqueda por texto
?id_destino=1        # Filtrar por destino (subdestinos)
?id_subdestino=1     # Filtrar por subdestino (servicios, paquetes)
?tipo=hospedaje      # Filtrar por tipo (servicios)
?tipo_entidad=DESTINO # Filtrar por tipo de entidad (imágenes)
?id_entidad=1        # Filtrar por ID de entidad (imágenes)
```

## 🔐 Headers Requeridos

```http
Content-Type: application/json
Authorization: Bearer {token}
```

## 📝 Ejemplos de Body

### Crear Destino
```json
{
  "nombre": "Cartagena de Indias",
  "pais": "Colombia",
  "descripcion": "Ciudad histórica",
  "activo": true
}
```

### Crear Subdestino
```json
{
  "nombre": "Centro Histórico",
  "descripcion": "Zona amurallada",
  "id_destino": 1,
  "latitud": 10.3932,
  "longitud": -75.4832,
  "activo": true
}
```

### Crear Servicio
```json
{
  "nombre": "Tour Guiado",
  "tipo": "actividad",
  "descripcion": "Recorrido por la ciudad",
  "id_subdestino": 1,
  "disponible_independiente": true,
  "activo": true
}
```

### Crear Paquete con Servicios
```json
{
  "nombre": "Tour Premium",
  "descripcion": "Experiencia completa",
  "duracion_horas": 8,
  "capacidad_maxima": 10,
  "id_subdestino": 1,
  "servicios": [
    {
      "id_servicio": 1,
      "es_opcional": false,
      "costo_adicional": 0,
      "cantidad_incluida": 1
    }
  ],
  "activo": true
}
```

### Crear Imagen
```json
{
  "url": "https://ejemplo.com/imagen.jpg",
  "alt_text": "Vista de la ciudad",
  "orden": 1,
  "tipo_entidad": "DESTINO",
  "id_entidad": 1,
  "es_principal": true,
  "activo": true
}
```

### Crear Usuario
```json
{
  "username": "nuevo_usuario",
  "email": "usuario@email.com",
  "password": "Password123!",
  "nombre_completo": "Juan Pérez",
  "rol": "editor",
  "activo": true
}
```

## 📊 Estructura de Respuesta

### Éxito
```json
{
  "success": true,
  "data": {
    // Datos de respuesta
  }
}
```

### Error
```json
{
  "success": false,
  "error": "Mensaje de error",
  "details": [] // Opcional
}
```

### Respuesta con Paginación
```json
{
  "success": true,
  "data": {
    "destinos": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 45,
      "pages": 5
    }
  }
}
```

## 🎭 Roles y Permisos

| Acción   | Admin | Editor | Viewer |
|----------|-------|--------|--------|
| GET      | ✅    | ✅     | ✅     |
| POST     | ✅    | ✅     | ❌     |
| PUT      | ✅    | ✅     | ❌     |
| DELETE   | ✅    | ❌     | ❌     |

## 🔴 Códigos HTTP

| Código | Significado |
|--------|------------|
| 200    | Éxito |
| 201    | Creado |
| 400    | Petición inválida |
| 401    | No autenticado |
| 403    | Sin permisos |
| 404    | No encontrado |
| 405    | Método no permitido |
| 500    | Error del servidor |

## 🧪 Ejemplo cURL

```bash
# Login
curl -X POST https://tu-dominio.com/API/auth/login.php \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin123!"}'

# Obtener destinos
curl -X GET https://tu-dominio.com/API/endpoints/destinos/index.php \
  -H "Authorization: Bearer {token}"

# Crear destino
curl -X POST https://tu-dominio.com/API/endpoints/destinos/index.php \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Test","pais":"Colombia","descripcion":"Test"}'
```

## 🔧 Configuración

Archivos a configurar antes de usar:

1. **config/database.php** - Credenciales de MySQL
2. **config/jwt.php** - Secreto JWT
3. **.htaccess** - Configuración de Apache

## 📚 Recursos Adicionales

- README.md - Documentación completa
- INTEGRACION_REACT.md - Guía de integración con React
- test_connection.php - Test de conexión a la base de datos

---

**Nota**: Esta es una referencia rápida. Consulta README.md para documentación completa.
