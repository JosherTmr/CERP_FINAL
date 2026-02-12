<?php
/**
 * API CRUD - IMAGENES
 * Gestión de imágenes polimórficas
 */

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../utils/helpers.php';

setCorsHeaders();

$database = new Database();
$db = $database->getConnection();
if (!$db) respondError('Error de conexión', 500);

$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uriParts = explode('/', $uri);
$id = isset($uriParts[count($uriParts) - 1]) && is_numeric($uriParts[count($uriParts) - 1]) ? (int)$uriParts[count($uriParts) - 1] : null;

switch ($method) {
    case 'GET': $id ? getById($db, $id) : getAll($db); break;
    case 'POST': $user = requireAuth(); requireEditor($user); create($db); break;
    case 'PUT': $user = requireAuth(); requireEditor($user); if (!$id) respondError('ID requerido', 400); update($db, $id); break;
    case 'DELETE': $user = requireAuth(); requireAdmin($user); if (!$id) respondError('ID requerido', 400); delete($db, $id); break;
    default: respondError('Método no permitido', 405);
}

function getAll($db) {
    try {
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
        $tipo_entidad = isset($_GET['tipo_entidad']) ? $_GET['tipo_entidad'] : null;
        $id_entidad = isset($_GET['id_entidad']) ? (int)$_GET['id_entidad'] : null;
        $activo = isset($_GET['activo']) ? (int)$_GET['activo'] : null;

        $pagination = getPagination($page, $limit);
        $where = [];
        $params = [];

        if ($tipo_entidad) {
            $where[] = "tipo_entidad = :tipo_entidad";
            $params['tipo_entidad'] = $tipo_entidad;
        }
        if ($id_entidad !== null) {
            $where[] = "id_entidad = :id_entidad";
            $params['id_entidad'] = $id_entidad;
        }
        if ($activo !== null) {
            $where[] = "activo = :activo";
            $params['activo'] = $activo;
        }

        $whereClause = !empty($where) ? "WHERE " . implode(" AND ", $where) : "";

        $countQuery = "SELECT COUNT(*) as total FROM IMAGENES $whereClause";
        $countStmt = $db->prepare($countQuery);
        $countStmt->execute($params);
        $total = $countStmt->fetch()['total'];

        $query = "SELECT * FROM IMAGENES 
                  $whereClause 
                  ORDER BY orden ASC, es_principal DESC
                  LIMIT :limit OFFSET :offset";

        $stmt = $db->prepare($query);
        $stmt->execute(array_merge($params, ['limit' => $pagination['limit'], 'offset' => $pagination['offset']]));

        respondSuccess([
            'imagenes' => $stmt->fetchAll(),
            'pagination' => [
                'page' => $pagination['page'],
                'limit' => $pagination['limit'],
                'total' => (int)$total,
                'pages' => ceil($total / $pagination['limit'])
            ]
        ]);
    } catch (Exception $e) {
        respondError('Error: ' . $e->getMessage(), 500);
    }
}

function getById($db, $id) {
    try {
        $stmt = $db->prepare("SELECT * FROM IMAGENES WHERE id_imagen = :id");
        $stmt->execute(['id' => $id]);
        $imagen = $stmt->fetch();

        if (!$imagen) respondError('Imagen no encontrada', 404);

        respondSuccess($imagen);
    } catch (Exception $e) {
        respondError('Error: ' . $e->getMessage(), 500);
    }
}

function create($db) {
    try {
        $input = getJsonInput();
        $errors = validateRequired($input, ['url', 'tipo_entidad', 'id_entidad']);
        if ($errors) respondError('Datos incompletos', 400, $errors);

        // Validar tipo_entidad
        $tiposValidos = ['DESTINO', 'SUBDESTINO', 'SERVICIO', 'PAQUETE'];
        if (!in_array($input['tipo_entidad'], $tiposValidos)) {
            respondError('tipo_entidad debe ser: ' . implode(', ', $tiposValidos), 400);
        }

        // Si es_principal = true, desmarcar otras imágenes principales de la misma entidad
        if (isset($input['es_principal']) && $input['es_principal']) {
            $updatePrincipal = $db->prepare(
                "UPDATE IMAGENES SET es_principal = 0 
                 WHERE tipo_entidad = :tipo_entidad AND id_entidad = :id_entidad"
            );
            $updatePrincipal->execute([
                'tipo_entidad' => $input['tipo_entidad'],
                'id_entidad' => (int)$input['id_entidad']
            ]);
        }

        $query = "INSERT INTO IMAGENES (url, alt_text, orden, tipo_entidad, id_entidad, es_principal, activo) 
                  VALUES (:url, :alt_text, :orden, :tipo_entidad, :id_entidad, :es_principal, :activo)";

        $stmt = $db->prepare($query);
        $stmt->execute([
            'url' => sanitizeString($input['url']),
            'alt_text' => isset($input['alt_text']) ? sanitizeString($input['alt_text']) : null,
            'orden' => isset($input['orden']) ? (int)$input['orden'] : 0,
            'tipo_entidad' => $input['tipo_entidad'],
            'id_entidad' => (int)$input['id_entidad'],
            'es_principal' => isset($input['es_principal']) ? (bool)$input['es_principal'] : false,
            'activo' => isset($input['activo']) ? (bool)$input['activo'] : true
        ]);

        respondSuccess(['message' => 'Imagen creada', 'id' => $db->lastInsertId()], 201);
    } catch (Exception $e) {
        respondError('Error: ' . $e->getMessage(), 500);
    }
}

function update($db, $id) {
    try {
        $input = getJsonInput();
        
        $fields = [];
        $params = ['id' => $id];

        if (isset($input['url'])) { $fields[] = "url = :url"; $params['url'] = sanitizeString($input['url']); }
        if (isset($input['alt_text'])) { $fields[] = "alt_text = :alt_text"; $params['alt_text'] = sanitizeString($input['alt_text']); }
        if (isset($input['orden'])) { $fields[] = "orden = :orden"; $params['orden'] = (int)$input['orden']; }
        if (isset($input['activo'])) { $fields[] = "activo = :activo"; $params['activo'] = (bool)$input['activo']; }
        
        // Manejar es_principal
        if (isset($input['es_principal']) && $input['es_principal']) {
            // Obtener info de la imagen actual
            $current = $db->prepare("SELECT tipo_entidad, id_entidad FROM IMAGENES WHERE id_imagen = :id");
            $current->execute(['id' => $id]);
            $imgInfo = $current->fetch();
            
            if ($imgInfo) {
                // Desmarcar otras principales
                $updatePrincipal = $db->prepare(
                    "UPDATE IMAGENES SET es_principal = 0 
                     WHERE tipo_entidad = :tipo_entidad AND id_entidad = :id_entidad AND id_imagen != :id"
                );
                $updatePrincipal->execute([
                    'tipo_entidad' => $imgInfo['tipo_entidad'],
                    'id_entidad' => $imgInfo['id_entidad'],
                    'id' => $id
                ]);
            }
            
            $fields[] = "es_principal = :es_principal";
            $params['es_principal'] = true;
        }

        if (empty($fields)) respondError('No hay datos para actualizar', 400);

        $stmt = $db->prepare("UPDATE IMAGENES SET " . implode(", ", $fields) . " WHERE id_imagen = :id");
        $stmt->execute($params);

        respondSuccess(['message' => 'Imagen actualizada']);
    } catch (Exception $e) {
        respondError('Error: ' . $e->getMessage(), 500);
    }
}

function delete($db, $id) {
    try {
        $stmt = $db->prepare("UPDATE IMAGENES SET activo = 0 WHERE id_imagen = :id");
        $stmt->execute(['id' => $id]);
        respondSuccess(['message' => 'Imagen eliminada']);
    } catch (Exception $e) {
        respondError('Error: ' . $e->getMessage(), 500);
    }
}
