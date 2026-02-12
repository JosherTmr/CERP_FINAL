<?php
/**
 * JWT Configuration
 * 
 * Configuración para JSON Web Tokens
 * Usado para autenticación de usuarios
 */

// ⚠️ IMPORTANTE: Cambia este SECRET por uno aleatorio y seguro
// Puedes generar uno usando: openssl rand -base64 32
define('JWT_SECRET', '4f6c5aafa1437f70c3ecdc58169908d9');

// Emisor del token (tu dominio)
define('JWT_ISSUER', 'turismo-lujo-api');

// Tiempo de expiración del token (24 horas)
define('JWT_EXPIRE_SECONDS', 86400);

// Algoritmo de encriptación
define('JWT_ALGORITHM', 'HS256');

/**
 * Generar un JWT
 * 
 * @param array $payload Datos a incluir en el token
 * @return string Token JWT generado
 */
function generateJWT($payload) {
    // Agregar datos estándar
    $payload['iss'] = JWT_ISSUER;
    $payload['iat'] = time();
    $payload['exp'] = time() + JWT_EXPIRE_SECONDS;

    // Codificar header
    $header = base64_encode(json_encode([
        'alg' => JWT_ALGORITHM,
        'typ' => 'JWT'
    ]));

    // Codificar payload
    $body = base64_encode(json_encode($payload));

    // Crear firma
    $signature = base64_encode(
        hash_hmac('sha256', "$header.$body", JWT_SECRET, true)
    );

    return "$header.$body.$signature";
}

/**
 * Verificar y decodificar un JWT
 * 
 * @param string $token Token JWT a verificar
 * @return array|false Payload del token o false si es inválido
 */
function verifyJWT($token) {
    try {
        // Separar el token en sus partes
        $parts = explode('.', $token);
        
        if (count($parts) !== 3) {
            return false;
        }

        list($header, $body, $signature) = $parts;

        // Verificar la firma
        $expectedSignature = base64_encode(
            hash_hmac('sha256', "$header.$body", JWT_SECRET, true)
        );

        if ($signature !== $expectedSignature) {
            return false;
        }

        // Decodificar el payload
        $payload = json_decode(base64_decode($body), true);

        // Verificar expiración
        if (isset($payload['exp']) && $payload['exp'] < time()) {
            return false;
        }

        return $payload;
        
    } catch (Exception $e) {
        return false;
    }
}

/**
 * Obtener el token desde los headers de la petición
 * 
 * @return string|null Token o null si no existe
 */
function getBearerToken() {
    $headers = getallheaders();
    
    if (isset($headers['Authorization'])) {
        $authorization = $headers['Authorization'];
        
        if (preg_match('/Bearer\s+(.*)$/i', $authorization, $matches)) {
            return $matches[1];
        }
    }
    
    return null;
}
