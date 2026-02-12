-- -----------------------------------------------------
-- Tabla: USERS (Sistema de Autenticación)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(100) NOT NULL UNIQUE,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `nombre_completo` VARCHAR(255) NULL,
  `rol` ENUM('admin', 'editor', 'viewer') NOT NULL DEFAULT 'viewer',
  `activo` BOOLEAN NOT NULL DEFAULT TRUE,
  `fecha_creacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ultima_actualizacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_username` (`username`),
  INDEX `idx_email` (`email`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Usuario Administrador por Defecto
-- Password: Admin123! (CÁMBIALO INMEDIATAMENTE)
-- -----------------------------------------------------
INSERT INTO `users` (`username`, `email`, `password_hash`, `nombre_completo`, `rol`) 
VALUES (
  'admin',
  'admin@turismolujo.com',
  '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- Password: Admin123!
  'Administrador del Sistema',
  'admin'
) ON DUPLICATE KEY UPDATE username = username;

-- -----------------------------------------------------
-- Índices adicionales para optimización
-- -----------------------------------------------------
ALTER TABLE `DESTINOS` ADD INDEX `idx_activo` (`activo`);
ALTER TABLE `SUBDESTINOS` ADD INDEX `idx_activo` (`activo`);
ALTER TABLE `SERVICIOS` ADD INDEX `idx_activo` (`activo`);
ALTER TABLE `SERVICIOS` ADD INDEX `idx_tipo` (`tipo`);
ALTER TABLE `PAQUETES` ADD INDEX `idx_activo` (`activo`);
ALTER TABLE `IMAGENES` ADD INDEX `idx_activo` (`activo`);
ALTER TABLE `IMAGENES` ADD INDEX `idx_es_principal` (`es_principal`);
