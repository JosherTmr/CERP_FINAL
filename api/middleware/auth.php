<?php
/**
 * Auth Middleware
 * 
 * Verifica que el usuario esté autenticado mediante JWT
 * Incluye este archivo al inicio de cualquier endpoint protegido
 */

require_once __DIR__ . '/../config/jwt.php';

/**
 * Verificar autenticación
 * 
 * @return array|void Datos del usuario o termina con error 401
 */
function requireAuth() {
    // Obtener el token del header Authorization
    $token = getBearerToken();

    if (!$token) {
        http_response_code(401);
        echo json_encode([
            'error' => 'No token provided',
            'message' => 'Se requiere autenticación'
        ]);
        exit;
    }

    // Verificar el token
    $payload = verifyJWT($token);

    if (!$payload) {
        http_response_code(401);
        echo json_encode([
            'error' => 'Invalid token',
            'message' => 'Token inválido o expirado'
        ]);
        exit;
    }

    // Retornar datos del usuario
    return $payload;
}

/**
 * Verificar rol de usuario
 * 
 * @param array $allowedRoles Roles permitidos
 * @param array $user Datos del usuario del token
 * @return void Termina con error 403 si no tiene permiso
 */
function requireRole($allowedRoles, $user) {
    $userRole = $user['rol'] ?? 'viewer';

    if (!in_array($userRole, $allowedRoles)) {
        http_response_code(403);
        echo json_encode([
            'error' => 'Forbidden',
            'message' => 'No tienes permisos para realizar esta acción'
        ]);
        exit;
    }
}

/**
 * Verificar que sea admin
 * 
 * @param array $user Datos del usuario del token
 * @return void Termina con error 403 si no es admin
 */
function requireAdmin($user) {
    requireRole(['admin'], $user);
}

/**
 * Verificar que sea admin o editor
 * 
 * @param array $user Datos del usuario del token
 * @return void Termina con error 403 si no tiene permiso
 */
function requireEditor($user) {
    requireRole(['admin', 'editor'], $user);
}
