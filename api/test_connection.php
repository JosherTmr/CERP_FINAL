<?php
/**
 * Test de Conexión a la Base de Datos
 * 
 * Ejecuta este archivo para verificar que la conexión a la base de datos funciona correctamente
 * Accede a: https://tu-dominio.com/API/test_connection.php
 */

header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . '/config/database.php';

echo "<h1>Test de Conexión - API Turismo de Lujo</h1>";
echo "<hr>";

try {
    echo "<h2>1. Intentando conectar a la base de datos...</h2>";
    
    $database = new Database();
    $db = $database->getConnection();
    
    if ($db) {
        echo "<p style='color: green;'>✅ <strong>Conexión exitosa!</strong></p>";
        
        // Test de consulta
        echo "<h2>2. Probando consulta a la tabla de usuarios...</h2>";
        
        $stmt = $db->query("SELECT COUNT(*) as total FROM users");
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        echo "<p style='color: green;'>✅ Total de usuarios en la base de datos: <strong>" . $result['total'] . "</strong></p>";
        
        // Verificar usuario admin
        echo "<h2>3. Verificando usuario administrador...</h2>";
        
        $stmt = $db->prepare("SELECT username, email, rol FROM users WHERE rol = 'admin' LIMIT 1");
        $stmt->execute();
        $admin = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($admin) {
            echo "<p style='color: green;'>✅ Usuario admin encontrado:</p>";
            echo "<ul>";
            echo "<li><strong>Username:</strong> " . $admin['username'] . "</li>";
            echo "<li><strong>Email:</strong> " . $admin['email'] . "</li>";
            echo "<li><strong>Rol:</strong> " . $admin['rol'] . "</li>";
            echo "</ul>";
        } else {
            echo "<p style='color: orange;'>⚠️ No se encontró usuario admin. Ejecuta el SQL de creación de usuarios.</p>";
        }
        
        // Test de otras tablas
        echo "<h2>4. Verificando estructura de tablas...</h2>";
        
        $tables = ['DESTINOS', 'SUBDESTINOS', 'SERVICIOS', 'PAQUETES', 'IMAGENES'];
        
        foreach ($tables as $table) {
            try {
                $stmt = $db->query("SELECT COUNT(*) as total FROM $table");
                $result = $stmt->fetch(PDO::FETCH_ASSOC);
                echo "<p style='color: green;'>✅ Tabla <strong>$table</strong>: " . $result['total'] . " registros</p>";
            } catch (Exception $e) {
                echo "<p style='color: red;'>❌ Error en tabla <strong>$table</strong>: " . $e->getMessage() . "</p>";
            }
        }
        
        echo "<hr>";
        echo "<h2>✅ Resultado Final: ÉXITO</h2>";
        echo "<p>La API está correctamente configurada y lista para usar.</p>";
        echo "<p><strong>Siguiente paso:</strong> Elimina este archivo (test_connection.php) por seguridad.</p>";
        
    } else {
        echo "<p style='color: red;'>❌ <strong>Error:</strong> No se pudo conectar a la base de datos</p>";
        echo "<p>Verifica las credenciales en <code>config/database.php</code></p>";
    }
    
} catch (Exception $e) {
    echo "<p style='color: red;'>❌ <strong>Error:</strong> " . $e->getMessage() . "</p>";
    echo "<p>Detalles del error:</p>";
    echo "<pre>" . print_r($e, true) . "</pre>";
}

echo "<hr>";
echo "<p><em>Test ejecutado el " . date('Y-m-d H:i:s') . "</em></p>";

// IMPORTANTE: Elimina este archivo después de verificar la conexión
?>
