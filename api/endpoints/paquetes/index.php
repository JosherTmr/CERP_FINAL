<?php
/**
 * API CRUD - PAQUETES
 * Incluye gestión de servicios asociados
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
        $activo = isset($_GET['activo']) ? (int)$_GET['activo'] : null;

        $pagination = getPagination($page, $limit);
        $where = [];
        $params = [];

        if ($id_subdestino !== null) {
            $where[] = "p.id_subdestino = :id_subdestino";
            $params['id_subdestino'] = $id_subdestino;
        }
        if ($activo !== null) {
            $where[] = "p.activo = :activo";
            $params['activo'] = $activo;
        }

        $whereClause = !empty($where) ? "WHERE " . implode(" AND ", $where) : "";

        $countQuery = "SELECT COUNT(*) as total FROM PAQUETES p $whereClause";
        $countStmt = $db->prepare($countQuery);
        $countStmt->execute($params);
        $total = $countStmt->fetch()['total'];

        $query = "SELECT p.*, sub.nombre as subdestino_nombre, d.nombre as destino_nombre
                  FROM PAQUETES p
                  LEFT JOIN SUBDESTINOS sub ON p.id_subdestino = sub.id_subdestino
                  LEFT JOIN DESTINOS d ON sub.id_destino = d.id_destino
                  $whereClause 
                  ORDER BY p.nombre ASC 
                  LIMIT :limit OFFSET :offset";

        $stmt = $db->prepare($query);
        $stmt->execute(array_merge($params, ['limit' => $pagination['limit'], 'offset' => $pagination['offset']]));

        respondSuccess([
            'paquetes' => $stmt->fetchAll(),
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
        $query = "SELECT p.*, sub.nombre as subdestino_nombre, d.nombre as destino_nombre
                  FROM PAQUETES p
                  LEFT JOIN SUBDESTINOS sub ON p.id_subdestino = sub.id_subdestino
                  LEFT JOIN DESTINOS d ON sub.id_destino = d.id_destino
                  WHERE p.id_paquete = :id";

        $stmt = $db->prepare($query);
        $stmt->execute(['id' => $id]);
        $paquete = $stmt->fetch();

        if (!$paquete) respondError('Paquete no encontrado', 404);

        // Obtener servicios del paquete
        $queryServ = "SELECT s.*, ps.es_opcional, ps.costo_adicional, ps.cantidad_incluida
                      FROM PAQUETE_SERVICIOS ps
                      JOIN SERVICIOS s ON ps.id_servicio = s.id_servicio
                      WHERE ps.id_paquete = :id";
        $stmtServ = $db->prepare($queryServ);
        $stmtServ->execute(['id' => $id]);
        $paquete['servicios'] = $stmtServ->fetchAll();

        // Obtener imágenes
        $queryImg = "SELECT * FROM IMAGENES WHERE tipo_entidad = 'PAQUETE' AND id_entidad = :id AND activo = 1 ORDER BY orden";
        $stmtImg = $db->prepare($queryImg);
        $stmtImg->execute(['id' => $id]);
        $paquete['imagenes'] = $stmtImg->fetchAll();

        respondSuccess($paquete);
    } catch (Exception $e) {
        respondError('Error: ' . $e->getMessage(), 500);
    }
}

function create($db) {
    try {
        $input = getJsonInput();
        $errors = validateRequired($input, ['nombre', 'descripcion', 'duracion_horas', 'capacidad_maxima', 'id_subdestino']);
        if ($errors) respondError('Datos incompletos', 400, $errors);

        $db->beginTransaction();

        // Insertar paquete
        $query = "INSERT INTO PAQUETES (nombre, descripcion, duracion_horas, capacidad_maxima, id_subdestino, activo) 
                  VALUES (:nombre, :descripcion, :duracion_horas, :capacidad_maxima, :id_subdestino, :activo)";

        $stmt = $db->prepare($query);
        $stmt->execute([
            'nombre' => sanitizeString($input['nombre']),
            'descripcion' => sanitizeString($input['descripcion']),
            'duracion_horas' => (int)$input['duracion_horas'],
            'capacidad_maxima' => (int)$input['capacidad_maxima'],
            'id_subdestino' => (int)$input['id_subdestino'],
            'activo' => isset($input['activo']) ? (bool)$input['activo'] : true
        ]);

        $id_paquete = $db->lastInsertId();

        // Agregar servicios si existen
        if (isset($input['servicios']) && is_array($input['servicios'])) {
            $queryServ = "INSERT INTO PAQUETE_SERVICIOS (id_paquete, id_servicio, es_opcional, costo_adicional, cantidad_incluida) 
                          VALUES (:id_paquete, :id_servicio, :es_opcional, :costo_adicional, :cantidad_incluida)";
            $stmtServ = $db->prepare($queryServ);

            foreach ($input['servicios'] as $servicio) {
                $stmtServ->execute([
                    'id_paquete' => $id_paquete,
                    'id_servicio' => (int)$servicio['id_servicio'],
                    'es_opcional' => isset($servicio['es_opcional']) ? (bool)$servicio['es_opcional'] : false,
                    'costo_adicional' => isset($servicio['costo_adicional']) ? (float)$servicio['costo_adicional'] : 0,
                    'cantidad_incluida' => isset($servicio['cantidad_incluida']) ? (int)$servicio['cantidad_incluida'] : 1
                ]);
            }
        }

        $db->commit();

        respondSuccess(['message' => 'Paquete creado', 'id' => $id_paquete], 201);
    } catch (Exception $e) {
        $db->rollBack();
        respondError('Error: ' . $e->getMessage(), 500);
    }
}

function update($db, $id) {
    try {
        $input = getJsonInput();
        $db->beginTransaction();

        $fields = [];
        $params = ['id' => $id];

        if (isset($input['nombre'])) { $fields[] = "nombre = :nombre"; $params['nombre'] = sanitizeString($input['nombre']); }
        if (isset($input['descripcion'])) { $fields[] = "descripcion = :descripcion"; $params['descripcion'] = sanitizeString($input['descripcion']); }
        if (isset($input['duracion_horas'])) { $fields[] = "duracion_horas = :duracion_horas"; $params['duracion_horas'] = (int)$input['duracion_horas']; }
        if (isset($input['capacidad_maxima'])) { $fields[] = "capacidad_maxima = :capacidad_maxima"; $params['capacidad_maxima'] = (int)$input['capacidad_maxima']; }
        if (isset($input['activo'])) { $fields[] = "activo = :activo"; $params['activo'] = (bool)$input['activo']; }

        if (!empty($fields)) {
            $stmt = $db->prepare("UPDATE PAQUETES SET " . implode(", ", $fields) . " WHERE id_paquete = :id");
            $stmt->execute($params);
        }

        // Actualizar servicios si se envían
        if (isset($input['servicios'])) {
            // Eliminar servicios existentes
            $db->prepare("DELETE FROM PAQUETE_SERVICIOS WHERE id_paquete = :id")->execute(['id' => $id]);

            // Agregar nuevos servicios
            $queryServ = "INSERT INTO PAQUETE_SERVICIOS (id_paquete, id_servicio, es_opcional, costo_adicional, cantidad_incluida) 
                          VALUES (:id_paquete, :id_servicio, :es_opcional, :costo_adicional, :cantidad_incluida)";
            $stmtServ = $db->prepare($queryServ);

            foreach ($input['servicios'] as $servicio) {
                $stmtServ->execute([
                    'id_paquete' => $id,
                    'id_servicio' => (int)$servicio['id_servicio'],
                    'es_opcional' => isset($servicio['es_opcional']) ? (bool)$servicio['es_opcional'] : false,
                    'costo_adicional' => isset($servicio['costo_adicional']) ? (float)$servicio['costo_adicional'] : 0,
                    'cantidad_incluida' => isset($servicio['cantidad_incluida']) ? (int)$servicio['cantidad_incluida'] : 1
                ]);
            }
        }

        $db->commit();
        respondSuccess(['message' => 'Paquete actualizado']);
    } catch (Exception $e) {
        $db->rollBack();
        respondError('Error: ' . $e->getMessage(), 500);
    }
}

function delete($db, $id) {
    try {
        $stmt = $db->prepare("UPDATE PAQUETES SET activo = 0 WHERE id_paquete = :id");
        $stmt->execute(['id' => $id]);
        respondSuccess(['message' => 'Paquete eliminado']);
    } catch (Exception $e) {
        respondError('Error: ' . $e->getMessage(), 500);
    }
}
