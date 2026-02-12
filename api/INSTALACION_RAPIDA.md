# 🚀 Instalación Rápida - 5 Minutos

Esta guía te permitirá poner en funcionamiento la API en menos de 5 minutos.

## ✅ Checklist de Instalación

### Paso 1: Subir Archivos (1 min)
- [ ] Descarga la carpeta `API` completa
- [ ] Sube la carpeta `API` a tu hosting vía FTP
- [ ] Ubicación: `public_html/API/` o `www/API/`

### Paso 2: Base de Datos (2 min)
- [ ] Accede a phpMyAdmin en tu hosting
- [ ] Crea una base de datos llamada `turismo_lujo_db`
- [ ] Ejecuta el archivo `01_tabla_usuarios.sql`
- [ ] Ejecuta tu esquema de base de datos existente

### Paso 3: Configurar Database (1 min)
Edita `config/database.php`:

```php
private $host = "localhost";              // ← Tu host
private $db_name = "turismo_lujo_db";    // ← Tu base de datos
private $username = "tu_usuario";         // ← Tu usuario MySQL
private $password = "tu_password";        // ← Tu contraseña MySQL
```

### Paso 4: Configurar JWT (30 seg)
Edita `config/jwt.php`:

```php
// Genera un secreto seguro en: https://generate-secret.now.sh/32
define('JWT_SECRET', 'PEGA_AQUI_TU_SECRETO_GENERADO');
```

### Paso 5: Verificar (30 seg)
- [ ] Accede a: `https://tu-dominio.com/API/test_connection.php`
- [ ] Si ves "✅ Conexión exitosa", ¡todo está bien!
- [ ] **ELIMINA** el archivo `test_connection.php` por seguridad

## 🎯 Primer Login

```bash
# En tu consola de navegador o Postman:
POST https://tu-dominio.com/API/auth/login.php

Body:
{
  "username": "admin",
  "password": "Admin123!"
}
```

**⚠️ IMPORTANTE**: Cambia la contraseña inmediatamente después del primer login.

## 🔧 Problemas Comunes

### "Database connection error"
→ Verifica las credenciales en `config/database.php`

### "CORS policy"
→ Verifica que `.htaccess` esté en la carpeta API

### "File not found"
→ Asegúrate de incluir `/index.php` en las URLs de endpoints

## 📋 Siguiente Paso

Lee `INTEGRACION_REACT.md` para conectar tu aplicación React con la API.

---

**¿Todo listo?** ¡Comienza a crear tus destinos turísticos! 🏖️
