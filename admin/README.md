# Panel de Administración - Turismo de Lujo

Panel de administración completo en HTML, CSS y JavaScript vanilla para gestionar todos los aspectos del sistema.

## 📋 Características

✅ **Login con JWT** - Autenticación segura  
✅ **Gestión Completa CRUD** - Para todas las entidades  
✅ **Gestión de Imágenes Múltiples** - Prioridad en la asignación de imágenes  
✅ **Sistema de Roles** - Admin, Editor, Viewer  
✅ **Búsqueda y Filtros** - En tiempo real  
✅ **Paginación** - Para grandes cantidades de datos  
✅ **Responsive** - Funciona en móviles y tablets  
✅ **Notificaciones Toast** - Feedback visual de acciones  
✅ **Interfaz Intuitiva** - Fácil de usar  

## 🚀 Instalación

### Paso 1: Configurar la URL de la API

Abre el archivo `admin-config.js` y cambia la URL de la API:

```javascript
const API_CONFIG = {
    baseURL: 'https://tu-dominio.com/API',  // ← CAMBIAR AQUÍ
    ...
};
```

### Paso 2: Subir los Archivos

Sube todos los archivos del panel admin a tu servidor:

```
public_html/
├── admin/
│   ├── admin.html              (archivo principal)
│   ├── admin-styles.css
│   ├── admin-config.js
│   ├── admin-api.js
│   ├── admin-ui.js
│   └── admin-main.js
```

### Paso 3: Acceder al Panel

Accede a: `https://tu-dominio.com/admin/admin.html`

**Credenciales por defecto:**
- Usuario: `admin`
- Contraseña: `Admin123!`

⚠️ **Cámbiala inmediatamente después del primer login**

## 📱 Funcionalidades Principales

### 1. Gestión de Destinos
- Crear, editar, eliminar destinos
- Asignar múltiples imágenes
- Filtrar por estado (activo/inactivo)
- Búsqueda por nombre o país

### 2. Gestión de Subdestinos
- Vincular subdestinos a destinos
- Coordenadas GPS (latitud/longitud)
- Asignar imágenes específicas
- Filtrar por destino padre

### 3. Gestión de Servicios
- Clasificar por tipo (hospedaje, transporte, actividad, etc.)
- Vincular a subdestinos
- Marcar disponibilidad independiente
- Galería de imágenes

### 4. Gestión de Paquetes
- Crear paquetes turísticos
- Definir duración y capacidad
- Vincular múltiples servicios (próximamente)
- Galería de imágenes

### 5. Galería de Imágenes (⭐ Prioridad)
- **Vista dedicada** para gestionar todas las imágenes
- **Múltiples imágenes por entidad**
- **Marcar imagen principal** - Una por entidad
- **Ordenar imágenes** - Control de orden de visualización
- **Preview en tiempo real** - Ver imagen antes de agregar
- **Gestión desde cada entidad** - Botón directo en tablas

#### Cómo Funciona la Gestión de Imágenes:

1. **Desde la tabla de cualquier entidad:**
   - Click en el botón azul con icono de imágenes 🖼️
   - Se abre el gestor de imágenes específico

2. **Agregar nueva imagen:**
   - Pega la URL de la imagen
   - Texto alternativo (opcional pero recomendado)
   - Define el orden (0 es primero)
   - Marca como "Principal" si es la imagen destacada
   - Preview automático al escribir URL válida

3. **Gestionar imágenes existentes:**
   - Ver todas las imágenes de la entidad
   - Marcar cualquiera como principal (estrella ⭐)
   - Eliminar imágenes que no necesites
   - La imagen principal tiene badge especial

### 6. Gestión de Usuarios
- Solo administradores pueden crear/eliminar usuarios
- Asignar roles (admin, editor, viewer)
- Cambiar contraseñas
- Activar/desactivar cuentas

## 🎨 Interfaz de Usuario

### Barra Lateral (Sidebar)
- Navegación rápida entre secciones
- Información del usuario actual
- Botón de cerrar sesión

### Área de Contenido
- Barra de búsqueda global
- Filtros por estado y entidad padre
- Tabla con todos los datos
- Paginación automática

### Acciones Rápidas
- **Botón Azul 🖼️** - Gestionar imágenes
- **Botón Amarillo ✏️** - Editar
- **Botón Rojo 🗑️** - Eliminar (solo admin)

## 🔐 Permisos por Rol

| Acción | Admin | Editor | Viewer |
|--------|-------|--------|--------|
| Ver datos | ✅ | ✅ | ✅ |
| Crear | ✅ | ✅ | ❌ |
| Editar | ✅ | ✅ | ❌ |
| Eliminar | ✅ | ❌ | ❌ |
| Gestionar usuarios | ✅ | ❌ | ❌ |
| Gestionar imágenes | ✅ | ✅ | ❌ |

## 💡 Tips de Uso

### Búsqueda
- La búsqueda es en tiempo real (espera 500ms)
- Busca en nombre, descripción y campos relevantes
- Funciona con los filtros activos

### Imágenes
- **Usar URLs públicas**: Las imágenes deben ser accesibles por URL
- **HTTPS recomendado**: Para mayor seguridad
- **Formatos soportados**: JPG, PNG, GIF, WebP
- **Una imagen principal**: Solo una imagen puede ser principal por entidad
- **Orden personalizable**: Número bajo = aparece primero

### Filtros
- Los filtros se combinan con la búsqueda
- Usa "Filtrar por Destino/Subdestino" para afinar resultados
- El filtro de estado (Activo/Inactivo) funciona en todas las secciones

### Formularios
- Los campos marcados con `*` son obligatorios
- Los select se cargan automáticamente
- Las validaciones se hacen antes de enviar

## 🐛 Solución de Problemas

### "Error de conexión"
→ Verifica la URL en `admin-config.js`  
→ Asegúrate que la API esté funcionando

### "Token inválido o expirado"
→ Vuelve a hacer login  
→ El token expira después de 24 horas

### "No se cargan las opciones de select"
→ Asegúrate que hay datos en las tablas relacionadas  
→ Ejemplo: Para crear subdestinos, debe haber destinos

### "La imagen no se muestra"
→ Verifica que la URL sea accesible públicamente  
→ Prueba abrir la URL en una pestaña nueva

### "No puedo eliminar"
→ Solo administradores pueden eliminar  
→ Verifica tu rol en la esquina superior izquierda

## 🔧 Personalización

### Cambiar colores
Edita las variables CSS en `admin-styles.css`:

```css
:root {
    --primary: #2563eb;    /* Color principal */
    --success: #10b981;    /* Verde éxito */
    --danger: #ef4444;     /* Rojo peligro */
    ...
}
```

### Ajustar items por página
En `admin-config.js`:

```javascript
const AppState = {
    itemsPerPage: 10,  // Cambia este número
    ...
};
```

### Agregar nuevos campos
Edita `SectionConfig` en `admin-config.js` y agrega campos al array `fields`.

## 📊 Estructura de Archivos

```
admin/
├── admin.html           - Estructura HTML
├── admin-styles.css     - Estilos y diseño
├── admin-config.js      - Configuración y estructura de datos
├── admin-api.js         - Cliente de API (fetch requests)
├── admin-ui.js          - Funciones de UI y renderizado
└── admin-main.js        - Lógica principal y event handlers
```

## 🚀 Mejoras Futuras Sugeridas

- [ ] Subida directa de imágenes (drag & drop)
- [ ] Crop y redimensión de imágenes
- [ ] Editor WYSIWYG para descripciones
- [ ] Exportar datos a Excel/CSV
- [ ] Modo oscuro
- [ ] Arrastrar y soltar para reordenar imágenes
- [ ] Vista previa de cómo se verá en el sitio público
- [ ] Gestión de servicios dentro de paquetes
- [ ] Calendario para reservas

## 📞 Soporte

Si encuentras algún problema:
1. Revisa la consola del navegador (F12)
2. Verifica que la API esté funcionando
3. Asegúrate de tener los permisos correctos

---

**Versión**: 1.0.0  
**Compatible con**: API Turismo de Lujo v1.0.0
