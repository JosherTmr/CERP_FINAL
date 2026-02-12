<?php
/**
 * API CRUD - DESTINOS
 * 
 * Endpoints para gestionar destinos turísticos
 */

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../utils/helpers.php';

setCorsHeaders();

// Obtener conexión a la base de datos
$database = new Database();
$db = $database->getConnection();

if (!$db) {
    respondError('Error de conexión a la base de datos', 500);
}

// Obtener método HTTP
$method = $_SERVER['REQUEST_METHOD'];

// Obtener ID si existe en la URL
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uriParts = explode('/', $uri);
$id = isset($uriParts[count($uriParts) - 1]) && is_numeric($uriParts[count($uriParts) - 1]) 
    ? (int)$uriParts[count($uriParts) - 1] 
    : null;

// Enrutamiento según método HTTP
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
        if (!$id) {
            respondError('ID requerido para actualizar', 400);
        }
        update($db, $id);
        break;

    case 'DELETE':
        $user = requireAuth();
        requireAdmin($user);
        if (!$id) {
            respondError('ID requerido para eliminar', 400);
        }
        delete($db, $id);
        break;

    default:
        respondError('Método no permitido', 405);
}

/**
 * Obtener todos los destinos
 */
function getAll($db) {
    try {
        // Parámetros de paginación y filtros
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
        $activo = isset($_GET['activo']) ? (int)$_GET['activo'] : null;
        $search = isset($_GET['search']) ? $_GET['search'] : null;

        $pagination = getPagination($page, $limit);

        // Construir query
        $where = [];
        $params = [];

        if ($activo !== null) {
            $where[] = "activo = :activo";
            $params['activo'] = $activo;
        }

        if ($search) {
            $where[] = "(nombre LIKE :search OR pais LIKE :search OR descripcion LIKE :search)";
            $params['search'] = "%$search%";
        }

        $whereClause = !empty($where) ? "WHERE " . implode(" AND ", $where) : "";

        // Contar total
        $countQuery = "SELECT COUNT(*) as total FROM DESTINOS $whereClause";
        $countStmt = $db->prepare($countQuery);
        $countStmt->execute($params);
        $total = $countStmt->fetch()['total'];

        // Obtener resultados
        $query = "SELECT * FROM DESTINOS 
                  $whereClause 
                  ORDER BY nombre ASC 
                  LIMIT :limit OFFSET :offset";

        $stmt = $db->prepare($query);
        $stmt->execute(array_merge($params, [
            'limit' => $pagination['limit'],
            'offset' => $pagination['offset']
        ]));

        $destinos = $stmt->fetchAll();

        respondSuccess([
            'destinos' => $destinos,
            'pagination' => [
                'page' => $pagination['page'],
                'limit' => $pagination['limit'],
                'total' => (int)$total,
                'pages' => ceil($total / $pagination['limit'])
            ]
        ]);

    } catch (Exception $e) {
        respondError('Error al obtener destinos: ' . $e->getMessage(), 500);
    }
}

/**
 * Obtener destino por ID
 */
function getById($db, $id) {
    try {
        $query = "SELECT d.*,
                  (SELECT COUNT(*) FROM SUBDESTINOS WHERE id_destino = d.id_destino AND activo = 1) as total_subdestinos
                  FROM DESTINOS d
                  WHERE d.id_destino = :id";

        $stmt = $db->prepare($query);
        $stmt->execute(['id' => $id]);
        $destino = $stmt->fetch();

        if (!$destino) {
            respondError('Destino no encontrado', 404);
        }

        // Obtener subdestinos
        $querySubdestinos = "SELECT * FROM SUBDESTINOS WHERE id_destino = :id AND activo = 1";
        $stmtSub = $db->prepare($querySubdestinos);
        $stmtSub->execute(['id' => $id]);
        $destino['subdestinos'] = $stmtSub->fetchAll();

        // Obtener imágenes
        $queryImg = "SELECT * FROM IMAGENES WHERE tipo_entidad = 'DESTINO' AND id_entidad = :id AND activo = 1 ORDER BY orden, es_principal DESC";
        $stmtImg = $db->prepare($queryImg);
        $stmtImg->execute(['id' => $id]);
        $destino['imagenes'] = $stmtImg->fetchAll();

        respondSuccess($destino);

    } catch (Exception $e) {
        respondError('Error al obtener destino: ' . $e->getMessage(), 500);
    }
}

/**
 * Crear nuevo destino
 */
function create($db) {
    try {
        $input = getJsonInput();

        // Validar campos requeridos
        $errors = validateRequired($input, ['nombre', 'pais', 'descripcion']);
        if ($errors) {
            respondError('Datos incompletos', 400, $errors);
        }

        // Sanitizar datos
        $nombre = sanitizeString($input['nombre']);
        $pais = sanitizeString($input['pais']);
        $descripcion = sanitizeString($input['descripcion']);
        $activo = isset($input['activo']) ? (bool)$input['activo'] : true;

        // Insertar
        $query = "INSERT INTO DESTINOS (nombre, pais, descripcion, activo) 
                  VALUES (:nombre, :pais, :descripcion, :activo)";

        $stmt = $db->prepare($query);
        $stmt->execute([
            'nombre' => $nombre,
            'pais' => $pais,
            'descripcion' => $descripcion,
            'activo' => $activo
        ]);

        $id = $db->lastInsertId();

        respondSuccess([
            'message' => 'Destino creado exitosamente',
            'id' => $id
        ], 201);

    } catch (Exception $e) {
        respondError('Error al crear destino: ' . $e->getMessage(), 500);
    }
}

/**
 * Actualizar destino
 */
function update($db, $id) {
    try {
        $input = getJsonInput();

        // Verificar que existe
        $checkQuery = "SELECT id_destino FROM DESTINOS WHERE id_destino = :id";
        $checkStmt = $db->prepare($checkQuery);
        $checkStmt->execute(['id' => $id]);

        if (!$checkStmt->fetch()) {
            respondError('Destino no encontrado', 404);
        }

        // Construir query de actualización dinámicamente
        $fields = [];
        $params = ['id' => $id];

        if (isset($input['nombre'])) {
            $fields[] = "nombre = :nombre";
            $params['nombre'] = sanitizeString($input['nombre']);
        }

        if (isset($input['pais'])) {
            $fields[] = "pais = :pais";
            $params['pais'] = sanitizeString($input['pais']);
        }

        if (isset($input['descripcion'])) {
            $fields[] = "descripcion = :descripcion";
            $params['descripcion'] = sanitizeString($input['descripcion']);
        }

        if (isset($input['activo'])) {
            $fields[] = "activo = :activo";
            $params['activo'] = (bool)$input['activo'];
        }

        if (empty($fields)) {
            respondError('No hay datos para actualizar', 400);
        }

        $query = "UPDATE DESTINOS SET " . implode(", ", $fields) . " WHERE id_destino = :id";
        $stmt = $db->prepare($query);
        $stmt->execute($params);

        respondSuccess([
            'message' => 'Destino actualizado exitosamente',
            'id' => $id
        ]);

    } catch (Exception $e) {
        respondError('Error al actualizar destino: ' . $e->getMessage(), 500);
    }
}

/**
 * Eliminar destino (soft delete)
 */
function delete($db, $id) {
    try {
        // Verificar que existe
        $checkQuery = "SELECT id_destino FROM DESTINOS WHERE id_destino = :id";
        $checkStmt = $db->prepare($checkQuery);
        $checkStmt->execute(['id' => $id]);

        if (!$checkStmt->fetch()) {
            respondError('Destino no encontrado', 404);
        }

        // Soft delete
        $query = "UPDATE DESTINOS SET activo = 0 WHERE id_destino = :id";
        $stmt = $db->prepare($query);
        $stmt->execute(['id' => $id]);

        respondSuccess([
            'message' => 'Destino eliminado exitosamente',
            'id' => $id
        ]);

    } catch (Exception $e) {
        respondError('Error al eliminar destino: ' . $e->getMessage(), 500);
    }
}
