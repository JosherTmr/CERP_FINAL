<?php
/**
 * API CRUD - SUBDESTINOS
 * 
 * Endpoints para gestionar subdestinos turísticos
 */

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../utils/helpers.php';

setCorsHeaders();

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    respondError('Error de conexión a la base de datos', 500);
}

$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uriParts = explode('/', $uri);
$id = isset($uriParts[count($uriParts) - 1]) && is_numeric($uriParts[count($uriParts) - 1]) 
    ? (int)$uriParts[count($uriParts) - 1] 
    : null;

switch ($method) {
    case 'GET':
        if ($id) {
            getById($db, $id);
        } else {
            getAll($db);
        }
        break;
    case 'POST':
        $user = requireAuth();
        requireEditor($user);
        create($db);
        break;
    case 'PUT':
        $user = requireAuth();
        requireEditor($user);
        if (!$id) respondError('ID requerido', 400);
        update($db, $id);
        break;
    case 'DELETE':
        $user = requireAuth();
        requireAdmin($user);
        if (!$id) respondError('ID requerido', 400);
        delete($db, $id);
        break;
    default:
        respondError('Método no permitido', 405);
}

function getAll($db) {
    try {
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
        $id_destino = isset($_GET['id_destino']) ? (int)$_GET['id_destino'] : null;
        $activo = isset($_GET['activo']) ? (int)$_GET['activo'] : null;
        $search = isset($_GET['search']) ? $_GET['search'] : null;

        $pagination = getPagination($page, $limit);

        $where = [];
        $params = [];

        if ($id_destino !== null) {
            $where[] = "s.id_destino = :id_destino";
            $params['id_destino'] = $id_destino;
        }

        if ($activo !== null) {
            $where[] = "s.activo = :activo";
            $params['activo'] = $activo;
        }

        if ($search) {
            $where[] = "(s.nombre LIKE :search OR s.descripcion LIKE :search)";
            $params['search'] = "%$search%";
        }

        $whereClause = !empty($where) ? "WHERE " . implode(" AND ", $where) : "";

        $countQuery = "SELECT COUNT(*) as total FROM SUBDESTINOS s $whereClause";
        $countStmt = $db->prepare($countQuery);
        $countStmt->execute($params);
        $total = $countStmt->fetch()['total'];

        $query = "SELECT s.*, d.nombre as destino_nombre, d.pais as destino_pais
                  FROM SUBDESTINOS s
                  LEFT JOIN DESTINOS d ON s.id_destino = d.id_destino
                  $whereClause 
                  ORDER BY s.nombre ASC 
                  LIMIT :limit OFFSET :offset";

        $stmt = $db->prepare($query);
        $stmt->execute(array_merge($params, [
            'limit' => $pagination['limit'],
            'offset' => $pagination['offset']
        ]));

        $subdestinos = $stmt->fetchAll();

        respondSuccess([
            'subdestinos' => $subdestinos,
            'pagination' => [
                'page' => $pagination['page'],
                'limit' => $pagination['limit'],
                'total' => (int)$total,
                'pages' => ceil($total / $pagination['limit'])
            ]
        ]);

    } catch (Exception $e) {
        respondError('Error al obtener subdestinos: ' . $e->getMessage(), 500);
    }
}

function getById($db, $id) {
    try {
        $query = "SELECT s.*, d.nombre as destino_nombre, d.pais as destino_pais,
                  (SELECT COUNT(*) FROM SERVICIOS WHERE id_subdestino = s.id_subdestino AND activo = 1) as total_servicios,
                  (SELECT COUNT(*) FROM PAQUETES WHERE id_subdestino = s.id_subdestino AND activo = 1) as total_paquetes
                  FROM SUBDESTINOS s
                  LEFT JOIN DESTINOS d ON s.id_destino = d.id_destino
                  WHERE s.id_subdestino = :id";

        $stmt = $db->prepare($query);
        $stmt->execute(['id' => $id]);
        $subdestino = $stmt->fetch();

        if (!$subdestino) {
            respondError('Subdestino no encontrado', 404);
        }

        // Obtener servicios
        $queryServicios = "SELECT * FROM SERVICIOS WHERE id_subdestino = :id AND activo = 1";
        $stmtServ = $db->prepare($queryServicios);
        $stmtServ->execute(['id' => $id]);
        $subdestino['servicios'] = $stmtServ->fetchAll();

        // Obtener paquetes
        $queryPaquetes = "SELECT * FROM PAQUETES WHERE id_subdestino = :id AND activo = 1";
        $stmtPaq = $db->prepare($queryPaquetes);
        $stmtPaq->execute(['id' => $id]);
        $subdestino['paquetes'] = $stmtPaq->fetchAll();

        // Obtener imágenes
        $queryImg = "SELECT * FROM IMAGENES WHERE tipo_entidad = 'SUBDESTINO' AND id_entidad = :id AND activo = 1 ORDER BY orden, es_principal DESC";
        $stmtImg = $db->prepare($queryImg);
        $stmtImg->execute(['id' => $id]);
        $subdestino['imagenes'] = $stmtImg->fetchAll();

        respondSuccess($subdestino);

    } catch (Exception $e) {
        respondError('Error al obtener subdestino: ' . $e->getMessage(), 500);
    }
}

function create($db) {
    try {
        $input = getJsonInput();

        $errors = validateRequired($input, ['nombre', 'id_destino', 'latitud', 'longitud']);
        if ($errors) {
            respondError('Datos incompletos', 400, $errors);
        }

        // Verificar que el destino existe
        $checkDestino = $db->prepare("SELECT id_destino FROM DESTINOS WHERE id_destino = :id");
        $checkDestino->execute(['id' => $input['id_destino']]);
        if (!$checkDestino->fetch()) {
            respondError('El destino especificado no existe', 400);
        }

        $query = "INSERT INTO SUBDESTINOS (nombre, descripcion, id_destino, latitud, longitud, activo) 
                  VALUES (:nombre, :descripcion, :id_destino, :latitud, :longitud, :activo)";

        $stmt = $db->prepare($query);
        $stmt->execute([
            'nombre' => sanitizeString($input['nombre']),
            'descripcion' => isset($input['descripcion']) ? sanitizeString($input['descripcion']) : null,
            'id_destino' => (int)$input['id_destino'],
            'latitud' => (float)$input['latitud'],
            'longitud' => (float)$input['longitud'],
            'activo' => isset($input['activo']) ? (bool)$input['activo'] : true
        ]);

        respondSuccess([
            'message' => 'Subdestino creado exitosamente',
            'id' => $db->lastInsertId()
        ], 201);

    } catch (Exception $e) {
        respondError('Error al crear subdestino: ' . $e->getMessage(), 500);
    }
}

function update($db, $id) {
    try {
        $input = getJsonInput();

        $checkQuery = "SELECT id_subdestino FROM SUBDESTINOS WHERE id_subdestino = :id";
        $checkStmt = $db->prepare($checkQuery);
        $checkStmt->execute(['id' => $id]);

        if (!$checkStmt->fetch()) {
            respondError('Subdestino no encontrado', 404);
        }

        $fields = [];
        $params = ['id' => $id];

        if (isset($input['nombre'])) {
            $fields[] = "nombre = :nombre";
            $params['nombre'] = sanitizeString($input['nombre']);
        }

        if (isset($input['descripcion'])) {
            $fields[] = "descripcion = :descripcion";
            $params['descripcion'] = sanitizeString($input['descripcion']);
        }

        if (isset($input['id_destino'])) {
            $checkDestino = $db->prepare("SELECT id_destino FROM DESTINOS WHERE id_destino = :id");
            $checkDestino->execute(['id' => $input['id_destino']]);
            if (!$checkDestino->fetch()) {
                respondError('El destino especificado no existe', 400);
            }
            $fields[] = "id_destino = :id_destino";
            $params['id_destino'] = (int)$input['id_destino'];
        }

        if (isset($input['latitud'])) {
            $fields[] = "latitud = :latitud";
            $params['latitud'] = (float)$input['latitud'];
        }

        if (isset($input['longitud'])) {
            $fields[] = "longitud = :longitud";
            $params['longitud'] = (float)$input['longitud'];
        }

        if (isset($input['activo'])) {
            $fields[] = "activo = :activo";
            $params['activo'] = (bool)$input['activo'];
        }

        if (empty($fields)) {
            respondError('No hay datos para actualizar', 400);
        }

        $query = "UPDATE SUBDESTINOS SET " . implode(", ", $fields) . " WHERE id_subdestino = :id";
        $stmt = $db->prepare($query);
        $stmt->execute($params);

        respondSuccess([
            'message' => 'Subdestino actualizado exitosamente',
            'id' => $id
        ]);

    } catch (Exception $e) {
        respondError('Error al actualizar subdestino: ' . $e->getMessage(), 500);
    }
}

function delete($db, $id) {
    try {
        $checkQuery = "SELECT id_subdestino FROM SUBDESTINOS WHERE id_subdestino = :id";
        $checkStmt = $db->prepare($checkQuery);
        $checkStmt->execute(['id' => $id]);

        if (!$checkStmt->fetch()) {
            respondError('Subdestino no encontrado', 404);
        }

        $query = "UPDATE SUBDESTINOS SET activo = 0 WHERE id_subdestino = :id";
        $stmt = $db->prepare($query);
        $stmt->execute(['id' => $id]);

        respondSuccess([
            'message' => 'Subdestino eliminado exitosamente',
            'id' => $id
        ]);

    } catch (Exception $e) {
        respondError('Error al eliminar subdestino: ' . $e->getMessage(), 500);
    }
}
