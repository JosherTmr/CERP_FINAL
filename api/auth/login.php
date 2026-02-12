<?php
/**
 * API - LOGIN
 * 
 * Endpoint para autenticación de usuarios
 */

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, Accept");
header("Access-Control-Allow-Credentials: true");

// Responder a peticiones OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/jwt.php';
require_once __DIR__ . '/../utils/helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respondError('Método no permitido', 405);
}

// Obtener datos de entrada
$input = getJsonInput();

$username = trim($input['username'] ?? '');
$password = $input['password'] ?? '';

if (!$username || !$password) {
    respondError('Usuario y contraseña requeridos', 400);
}

try {
    // Conectar a la base de datos
    $database = new Database();
    $db = $database->getConnection();

    if (!$db) {
        respondError('Error de conexión a la base de datos', 500);
    }

    // Buscar usuario
    $stmt = $db->prepare("
        SELECT id, username, password_hash, email, nombre_completo, rol, activo
        FROM users 
        WHERE username = :username 
        LIMIT 1
    ");
    $stmt->execute(['username' => $username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Verificar credenciales
    if (!$user || !password_verify($password, $user['password_hash'])) {
        respondError('Credenciales inválidas', 401);
    }

    // Verificar que el usuario esté activo
    if (!$user['activo']) {
        respondError('Usuario desactivado. Contacte al administrador', 403);
    }

    // Generar JWT
    $payload = [
        'sub' => $user['id'],
        'username' => $user['username'],
        'email' => $user['email'],
        'rol' => $user['rol']
    ];

    $token = generateJWT($payload);

    // Respuesta exitosa
    respondSuccess([
        'token' => $token,
        'user' => [
            'id' => $user['id'],
            'username' => $user['username'],
            'email' => $user['email'],
            'nombre_completo' => $user['nombre_completo'],
            'rol' => $user['rol']
        ],
        'expires_in' => JWT_EXPIRE_SECONDS
    ]);

} catch (Exception $e) {
    respondError('Error en el login: ' . $e->getMessage(), 500);
}
