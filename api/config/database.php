<?php
/**
 * Database Connection Class
 * 
 * Maneja la conexión a la base de datos MySQL usando PDO
 * con manejo de errores y configuración segura
 */

class Database {
    // Configuración de la base de datos
    // ⚠️ IMPORTANTE: Cambia estos valores con tus credenciales reales
    private $host = "localhost";              // Host de tu base de datos
    private $db_name = "cartagen_database";    // Nombre de tu base de datos
    private $username = "cartagen_joshertmr";         // Usuario de la base de datos
    private $password = "JNv6S3LhRy7VNTn";        // Contraseña de la base de datos
    private $charset = "utf8mb4";
    
    public $conn;

    /**
     * Obtener conexión a la base de datos
     * 
     * @return PDO|null Objeto PDO de conexión o null en caso de error
     */
    public function getConnection() {
        $this->conn = null;

        try {
            // DSN (Data Source Name)
            $dsn = "mysql:host=" . $this->host . 
                   ";dbname=" . $this->db_name . 
                   ";charset=" . $this->charset;
            
            // Opciones de PDO para seguridad y rendimiento
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
            ];

            // Crear nueva conexión PDO
            $this->conn = new PDO($dsn, $this->username, $this->password, $options);
            
        } catch(PDOException $exception) {
            // Log de error (en producción, usa un sistema de logs apropiado)
            error_log("Database connection error: " . $exception->getMessage());
            
            // No mostrar detalles del error en producción
            if (getenv('ENVIRONMENT') === 'development') {
                echo "Connection error: " . $exception->getMessage();
            }
        }

        return $this->conn;
    }

    /**
     * Cerrar conexión
     */
    public function closeConnection() {
        $this->conn = null;
    }

    /**
     * Verificar si la conexión está activa
     * 
     * @return bool
     */
    public function isConnected() {
        return $this->conn !== null;
    }
}
