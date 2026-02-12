<?php
/**
 * API CRUD - USERS
 * Gestión de usuarios del sistema
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

// Verificar autenticación para todos los métodos
$currentUser = requireAuth();

switch ($method) {
    case 'GET': 
        if ($id) {
            getById($db, $id, $currentUser); 
        } else {
            requireAdmin($currentUser); // Solo admin puede listar todos
            getAll($db);
        }
        break;
    case 'POST': 
        requireAdmin($currentUser);
        create($db);
        break;
    case 'PUT': 
        if (!$id) respondError('ID requerido', 400);
        // Admin puede editar cualquiera, usuarios solo a sí mismos
        if ($currentUser['rol'] !== 'admin' && $currentUser['sub'] != $id) {
            respondError('No tienes permiso para editar este usuario', 403);
        }
        update($db, $id, $currentUser);
        break;
    case 'DELETE': 
        requireAdmin($currentUser);
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
        $activo = isset($_GET['activo']) ? (int)$_GET['activo'] : null;
        $rol = isset($_GET['rol']) ? $_GET['rol'] : null;

        $pagination = getPagination($page, $limit);
        $where = [];
        $params = [];

        if ($activo !== null) {
            $where[] = "activo = :activo";
            $params['activo'] = $activo;
        }
        if ($rol) {
            $where[] = "rol = :rol";
            $params['rol'] = $rol;
        }

        $whereClause = !empty($where) ? "WHERE " . implode(" AND ", $where) : "";

        $countQuery = "SELECT COUNT(*) as total FROM users $whereClause";
        $countStmt = $db->prepare($countQuery);
        $countStmt->execute($params);
        $total = $countStmt->fetch()['total'];

        $query = "SELECT id, username, email, nombre_completo, rol, activo, fecha_creacion, ultima_actualizacion
                  FROM users 
                  $whereClause 
                  ORDER BY fecha_creacion DESC 
                  LIMIT :limit OFFSET :offset";

        $stmt = $db->prepare($query);
        $stmt->execute(array_merge($params, ['limit' => $pagination['limit'], 'offset' => $pagination['offset']]));

        respondSuccess([
            'users' => $stmt->fetchAll(),
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

function getById($db, $id, $currentUser) {
    try {
        // Admin puede ver cualquier usuario, otros solo a sí mismos
        if ($currentUser['rol'] !== 'admin' && $currentUser['sub'] != $id) {
            respondError('No tienes permiso para ver este usuario', 403);
        }

        $stmt = $db->prepare("SELECT id, username, email, nombre_completo, rol, activo, fecha_creacion, ultima_actualizacion 
                              FROM users WHERE id = :id");
        $stmt->execute(['id' => $id]);
        $user = $stmt->fetch();

        if (!$user) respondError('Usuario no encontrado', 404);

        respondSuccess($user);
    } catch (Exception $e) {
        respondError('Error: ' . $e->getMessage(), 500);
    }
}

function create($db) {
    try {
        $input = getJsonInput();
        $errors = validateRequired($input, ['username', 'email', 'password']);
        if ($errors) respondError('Datos incompletos', 400, $errors);

        // Validar email
        if (!isValidEmail($input['email'])) {
            respondError('Email inválido', 400);
        }

        // Validar contraseña (mínimo 8 caracteres)
        if (strlen($input['password']) < 8) {
            respondError('La contraseña debe tener al menos 8 caracteres', 400);
        }

        // Verificar que username y email no existan
        $checkStmt = $db->prepare("SELECT id FROM users WHERE username = :username OR email = :email");
        $checkStmt->execute([
            'username' => $input['username'],
            'email' => $input['email']
        ]);
        
        if ($checkStmt->fetch()) {
            respondError('El username o email ya existe', 400);
        }

        // Validar rol
        $rolesValidos = ['admin', 'editor', 'viewer'];
        $rol = isset($input['rol']) ? $input['rol'] : 'viewer';
        if (!in_array($rol, $rolesValidos)) {
            respondError('Rol debe ser: ' . implode(', ', $rolesValidos), 400);
        }

        // Hash de contraseña
        $passwordHash = password_hash($input['password'], PASSWORD_DEFAULT);

        $query = "INSERT INTO users (username, email, password_hash, nombre_completo, rol, activo) 
                  VALUES (:username, :email, :password_hash, :nombre_completo, :rol, :activo)";

        $stmt = $db->prepare($query);
        $stmt->execute([
            'username' => sanitizeString($input['username']),
            'email' => sanitizeString($input['email']),
            'password_hash' => $passwordHash,
            'nombre_completo' => isset($input['nombre_completo']) ? sanitizeString($input['nombre_completo']) : null,
            'rol' => $rol,
            'activo' => isset($input['activo']) ? (bool)$input['activo'] : true
        ]);

        respondSuccess(['message' => 'Usuario creado', 'id' => $db->lastInsertId()], 201);
    } catch (Exception $e) {
        respondError('Error: ' . $e->getMessage(), 500);
    }
}

function update($db, $id, $currentUser) {
    try {
        $input = getJsonInput();
        $fields = [];
        $params = ['id' => $id];

        // Verificar que el usuario existe
        $checkStmt = $db->prepare("SELECT id, username, email FROM users WHERE id = :id");
        $checkStmt->execute(['id' => $id]);
        $existingUser = $checkStmt->fetch();
        
        if (!$existingUser) {
            respondError('Usuario no encontrado', 404);
        }

        if (isset($input['username'])) { 
            $fields[] = "username = :username"; 
            $params['username'] = sanitizeString($input['username']); 
        }
        
        if (isset($input['email'])) { 
            if (!isValidEmail($input['email'])) {
                respondError('Email inválido', 400);
            }
            $fields[] = "email = :email"; 
            $params['email'] = sanitizeString($input['email']); 
        }
        
        if (isset($input['nombre_completo'])) { 
            $fields[] = "nombre_completo = :nombre_completo"; 
            $params['nombre_completo'] = sanitizeString($input['nombre_completo']); 
        }

        // Solo admin puede cambiar rol y estado activo
        if ($currentUser['rol'] === 'admin') {
            if (isset($input['rol'])) {
                $rolesValidos = ['admin', 'editor', 'viewer'];
                if (!in_array($input['rol'], $rolesValidos)) {
                    respondError('Rol debe ser: ' . implode(', ', $rolesValidos), 400);
                }
                $fields[] = "rol = :rol";
                $params['rol'] = $input['rol'];
            }
            
            if (isset($input['activo'])) { 
                $fields[] = "activo = :activo"; 
                $params['activo'] = (bool)$input['activo']; 
            }
        }

        // Cambiar contraseña (cualquier usuario puede cambiar su propia contraseña)
        if (isset($input['password'])) {
            if (strlen($input['password']) < 8) {
                respondError('La contraseña debe tener al menos 8 caracteres', 400);
            }
            $fields[] = "password_hash = :password_hash";
            $params['password_hash'] = password_hash($input['password'], PASSWORD_DEFAULT);
        }

        if (empty($fields)) respondError('No hay datos para actualizar', 400);

        $stmt = $db->prepare("UPDATE users SET " . implode(", ", $fields) . " WHERE id = :id");
        $stmt->execute($params);

        respondSuccess(['message' => 'Usuario actualizado']);
    } catch (Exception $e) {
        respondError('Error: ' . $e->getMessage(), 500);
    }
}

function delete($db, $id) {
    try {
        // Soft delete
        $stmt = $db->prepare("UPDATE users SET activo = 0 WHERE id = :id");
        $stmt->execute(['id' => $id]);
        respondSuccess(['message' => 'Usuario eliminado']);
    } catch (Exception $e) {
        respondError('Error: ' . $e->getMessage(), 500);
    }
}
