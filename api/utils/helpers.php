<?php
/**
 * Utilities
 * 
 * Funciones de utilidad común para los endpoints
 */

/**
 * Configurar headers CORS y JSON
 */
function setCorsHeaders() {
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, Accept");
    header("Access-Control-Allow-Credentials: true");

    // Responder a peticiones OPTIONS (preflight)
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
}

/**
 * Obtener datos JSON del body de la petición
 * 
 * @return array Datos decodificados
 */
function getJsonInput() {
    return json_decode(file_get_contents("php://input"), true) ?? [];
}

/**
 * Validar campos requeridos
 * 
 * @param array $data Datos a validar
 * @param array $required Campos requeridos
 * @return array|null Errores o null si todo es válido
 */
function validateRequired($data, $required) {
    $errors = [];

    foreach ($required as $field) {
        if (!isset($data[$field]) || trim($data[$field]) === '') {
            $errors[] = "El campo '$field' es requerido";
        }
    }

    return empty($errors) ? null : $errors;
}

/**
 * Sanitizar string
 * 
 * @param string $str String a sanitizar
 * @return string String sanitizado
 */
function sanitizeString($str) {
    return htmlspecialchars(strip_tags(trim($str)), ENT_QUOTES, 'UTF-8');
}

/**
 * Validar email
 * 
 * @param string $email Email a validar
 * @return bool
 */
function isValidEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

/**
 * Responder con éxito
 * 
 * @param mixed $data Datos a devolver
 * @param int $code Código HTTP
 */
function respondSuccess($data, $code = 200) {
    http_response_code($code);
    echo json_encode([
        'success' => true,
        'data' => $data
    ]);
    exit;
}

/**
 * Responder con error
 * 
 * @param string $message Mensaje de error
 * @param int $code Código HTTP
 * @param mixed $details Detalles adicionales del error
 */
function respondError($message, $code = 400, $details = null) {
    http_response_code($code);
    $response = [
        'success' => false,
        'error' => $message
    ];
    
    if ($details !== null) {
        $response['details'] = $details;
    }
    
    echo json_encode($response);
    exit;
}

/**
 * Validar método HTTP
 * 
 * @param string|array $allowedMethods Métodos permitidos
 */
function validateMethod($allowedMethods) {
    if (!is_array($allowedMethods)) {
        $allowedMethods = [$allowedMethods];
    }

    if (!in_array($_SERVER['REQUEST_METHOD'], $allowedMethods)) {
        respondError('Método no permitido', 405);
    }
}

/**
 * Generar slug desde un string
 * 
 * @param string $str String a convertir
 * @return string Slug generado
 */
function generateSlug($str) {
    $str = strtolower(trim($str));
    $str = preg_replace('/[^a-z0-9-]/', '-', $str);
    $str = preg_replace('/-+/', '-', $str);
    return trim($str, '-');
}

/**
 * Validar rango de números
 * 
 * @param mixed $value Valor a validar
 * @param int $min Valor mínimo
 * @param int $max Valor máximo
 * @return bool
 */
function isInRange($value, $min, $max) {
    return is_numeric($value) && $value >= $min && $value <= $max;
}

/**
 * Paginar resultados
 * 
 * @param int $page Página actual
 * @param int $limit Resultados por página
 * @return array [offset, limit]
 */
function getPagination($page = 1, $limit = 10) {
    $page = max(1, (int)$page);
    $limit = max(1, min(100, (int)$limit)); // Máximo 100 por página
    $offset = ($page - 1) * $limit;
    
    return [
        'offset' => $offset,
        'limit' => $limit,
        'page' => $page
    ];
}
