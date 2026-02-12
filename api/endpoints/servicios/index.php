<?php
/**
 * API CRUD - SERVICIOS
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
        $id_subdestino = isset($_GET['id_subdestino']) ? (int)$_GET['id_subdestino'] : null;
        $tipo = isset($_GET['tipo']) ? $_GET['tipo'] : null;
        $activo = isset($_GET['activo']) ? (int)$_GET['activo'] : null;

        $pagination = getPagination($page, $limit);
        $where = [];
        $params = [];

        if ($id_subdestino !== null) {
            $where[] = "serv.id_subdestino = :id_subdestino";
            $params['id_subdestino'] = $id_subdestino;
        }
        if ($tipo) {
            $where[] = "serv.tipo = :tipo";
            $params['tipo'] = $tipo;
        }
        if ($activo !== null) {
            $where[] = "serv.activo = :activo";
            $params['activo'] = $activo;
        }

        $whereClause = !empty($where) ? "WHERE " . implode(" AND ", $where) : "";

        $countQuery = "SELECT COUNT(*) as total FROM SERVICIOS serv $whereClause";
        $countStmt = $db->prepare($countQuery);
        $countStmt->execute($params);
        $total = $countStmt->fetch()['total'];

        $query = "SELECT serv.*, sub.nombre as subdestino_nombre
                  FROM SERVICIOS serv
                  LEFT JOIN SUBDESTINOS sub ON serv.id_subdestino = sub.id_subdestino
                  $whereClause 
                  ORDER BY serv.nombre ASC 
                  LIMIT :limit OFFSET :offset";

        $stmt = $db->prepare($query);
        $stmt->execute(array_merge($params, ['limit' => $pagination['limit'], 'offset' => $pagination['offset']]));

        respondSuccess([
            'servicios' => $stmt->fetchAll(),
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
        $query = "SELECT serv.*, sub.nombre as subdestino_nombre
                  FROM SERVICIOS serv
                  LEFT JOIN SUBDESTINOS sub ON serv.id_subdestino = sub.id_subdestino
                  WHERE serv.id_servicio = :id";

        $stmt = $db->prepare($query);
        $stmt->execute(['id' => $id]);
        $servicio = $stmt->fetch();

        if (!$servicio) respondError('Servicio no encontrado', 404);

        $queryImg = "SELECT * FROM IMAGENES WHERE tipo_entidad = 'SERVICIO' AND id_entidad = :id AND activo = 1 ORDER BY orden";
        $stmtImg = $db->prepare($queryImg);
        $stmtImg->execute(['id' => $id]);
        $servicio['imagenes'] = $stmtImg->fetchAll();

        respondSuccess($servicio);
    } catch (Exception $e) {
        respondError('Error: ' . $e->getMessage(), 500);
    }
}

function create($db) {
    try {
        $input = getJsonInput();
        $errors = validateRequired($input, ['nombre', 'tipo', 'id_subdestino']);
        if ($errors) respondError('Datos incompletos', 400, $errors);

        $query = "INSERT INTO SERVICIOS (nombre, tipo, descripcion, id_subdestino, disponible_independiente, activo) 
                  VALUES (:nombre, :tipo, :descripcion, :id_subdestino, :disponible_independiente, :activo)";

        $stmt = $db->prepare($query);
        $stmt->execute([
            'nombre' => sanitizeString($input['nombre']),
            'tipo' => sanitizeString($input['tipo']),
            'descripcion' => isset($input['descripcion']) ? sanitizeString($input['descripcion']) : null,
            'id_subdestino' => (int)$input['id_subdestino'],
            'disponible_independiente' => isset($input['disponible_independiente']) ? (bool)$input['disponible_independiente'] : true,
            'activo' => isset($input['activo']) ? (bool)$input['activo'] : true
        ]);

        respondSuccess(['message' => 'Servicio creado', 'id' => $db->lastInsertId()], 201);
    } catch (Exception $e) {
        respondError('Error: ' . $e->getMessage(), 500);
    }
}

function update($db, $id) {
    try {
        $input = getJsonInput();
        $fields = [];
        $params = ['id' => $id];

        if (isset($input['nombre'])) { $fields[] = "nombre = :nombre"; $params['nombre'] = sanitizeString($input['nombre']); }
        if (isset($input['tipo'])) { $fields[] = "tipo = :tipo"; $params['tipo'] = sanitizeString($input['tipo']); }
        if (isset($input['descripcion'])) { $fields[] = "descripcion = :descripcion"; $params['descripcion'] = sanitizeString($input['descripcion']); }
        if (isset($input['activo'])) { $fields[] = "activo = :activo"; $params['activo'] = (bool)$input['activo']; }

        if (empty($fields)) respondError('No hay datos para actualizar', 400);

        $stmt = $db->prepare("UPDATE SERVICIOS SET " . implode(", ", $fields) . " WHERE id_servicio = :id");
        $stmt->execute($params);

        respondSuccess(['message' => 'Servicio actualizado']);
    } catch (Exception $e) {
        respondError('Error: ' . $e->getMessage(), 500);
    }
}

function delete($db, $id) {
    try {
        $stmt = $db->prepare("UPDATE SERVICIOS SET activo = 0 WHERE id_servicio = :id");
        $stmt->execute(['id' => $id]);
        respondSuccess(['message' => 'Servicio eliminado']);
    } catch (Exception $e) {
        respondError('Error: ' . $e->getMessage(), 500);
    }
}
