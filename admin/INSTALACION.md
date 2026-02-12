# 🚀 Instalación Rápida - Panel Admin

## ⚡ 3 Pasos - 2 Minutos

### Paso 1: Configurar URL (30 seg)

Abre `admin-config.js` y cambia esta línea:

```javascript
const API_CONFIG = {
    baseURL: 'https://tu-dominio.com/API',  // ← CAMBIAR AQUÍ
```

Por tu URL real, por ejemplo:
```javascript
    baseURL: 'https://miturismo.com/API',
```

### Paso 2: Subir Archivos (1 min)

Sube la carpeta `admin` completa a tu servidor:

```
public_html/
└── admin/
    ├── admin.html
    ├── admin-styles.css
    ├── admin-config.js
    ├── admin-api.js
    ├── admin-ui.js
    └── admin-main.js
```

### Paso 3: Acceder (30 seg)

1. Abre: `https://tu-dominio.com/admin/admin.html`
2. Login: `admin` / `Admin123!`
3. **¡Listo!** 🎉

## ✨ Primera Vez

Después de entrar:

1. **Cambia tu contraseña**:
   - Click en "Usuarios" en el menú
   - Click en el botón amarillo (editar) de tu usuario
   - Pon una nueva contraseña
   - Guarda

2. **Prueba agregar imágenes**:
   - Ve a "Destinos"
   - Click en el botón azul 🖼️ de cualquier destino
   - Agrega una URL de imagen
   - ¡Verás el preview en tiempo real!

3. **Explora** todas las secciones del menú lateral

## 🎯 Accesos Rápidos

| Sección | Para qué sirve |
|---------|----------------|
| **Destinos** | Países/ciudades principales |
| **Subdestinos** | Zonas dentro de destinos |
| **Servicios** | Hoteles, tours, transporte |
| **Paquetes** | Combos de servicios |
| **Galería** | Vista de todas las imágenes |
| **Usuarios** | Gestionar accesos (solo admin) |

## 🖼️ Gestión de Imágenes - Lo Más Importante

### Desde Cualquier Tabla:
1. Click en botón AZUL con icono 🖼️
2. Se abre el gestor de imágenes
3. Pega URL de imagen
4. Click "Agregar Imagen"
5. ¡Listo!

### Marcar como Principal:
- Click en la ⭐ estrella de cualquier imagen
- Solo UNA puede ser principal

### Tips:
- Usa URLs de servicios como Imgur, Cloudinary, etc.
- O sube imágenes a tu servidor y usa esas URLs
- Orden: número bajo = aparece primero

## ❓ ¿Problemas?

### "No se conecta"
✅ Verifica la URL en `admin-config.js`

### "Error de login"
✅ Verifica que la API esté funcionando  
✅ Credenciales: `admin` / `Admin123!`

### "No veo el botón de Crear"
✅ Tu rol debe ser "admin" o "editor"

### "No puedo eliminar"
✅ Solo administradores pueden eliminar

## 📱 Desde el Móvil

El panel funciona perfecto en móviles:
- Menú se adapta automáticamente
- Tablas con scroll horizontal
- Formularios optimizados para touch

## 🎨 Es Bonito

- Diseño moderno y profesional
- Colores del sistema
- Animaciones suaves
- Iconos Font Awesome
- Notificaciones toast

---

**¿Todo listo?** Accede a tu panel y empieza a gestionar tu contenido 🚀
