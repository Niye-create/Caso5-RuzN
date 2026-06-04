-- =====================================================
-- PAYFLOW - DATABASE SCRIPT
-- =====================================================
-- Crear base de datos
CREATE DATABASE IF NOT EXISTS payflow;
USE payflow;

-- =====================================================
-- TABLA: usuarios
-- =====================================================
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('ADMIN', 'USER') DEFAULT 'USER',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
);

-- =====================================================
-- TABLA: accounts
-- =====================================================
CREATE TABLE IF NOT EXISTS accounts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  saldo DECIMAL(10, 2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_accounts_user FOREIGN KEY (user_id) 
    REFERENCES usuarios(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_account (user_id),
  INDEX idx_user_id (user_id)
);

-- =====================================================
-- TABLA: transactions
-- =====================================================
CREATE TABLE IF NOT EXISTS transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type ENUM('DEPOSIT', 'WITHDRAW', 'TRANSFER') NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  from_account_id INT,
  to_account_id INT,
  status ENUM('PENDING', 'SUCCESS', 'FAILED', 'REVERSED') DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_transactions_from FOREIGN KEY (from_account_id) 
    REFERENCES accounts(id) ON DELETE SET NULL,
  CONSTRAINT fk_transactions_to FOREIGN KEY (to_account_id) 
    REFERENCES accounts(id) ON DELETE SET NULL,
  INDEX idx_type (type),
  INDEX idx_status (status),
  INDEX idx_from_account (from_account_id),
  INDEX idx_to_account (to_account_id),
  INDEX idx_created_at (created_at)
);

-- =====================================================
-- TABLA: notifications
-- =====================================================
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  type VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  amount DECIMAL(10, 2),
  from_account_id INT,
  to_account_id INT,
  message TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) 
    REFERENCES usuarios(id) ON DELETE CASCADE,
  CONSTRAINT fk_notifications_from FOREIGN KEY (from_account_id) 
    REFERENCES accounts(id) ON DELETE SET NULL,
  CONSTRAINT fk_notifications_to FOREIGN KEY (to_account_id) 
    REFERENCES accounts(id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_type (type),
  INDEX idx_read (read),
  INDEX idx_created_at (created_at)
);

-- =====================================================
-- INSERTS DE PRUEBA (Opcional)
-- =====================================================
-- Si quieres datos de prueba, descomenta esto:

/*
-- Usuario regular
INSERT INTO usuarios (nombre, email, password_hash, role) VALUES 
('Usuario Test', 'test@example.com', '$2b$10$hash_de_ejemplo_aqui', 'USER');

-- Crear cuenta para el usuario
INSERT INTO accounts (user_id, saldo) VALUES (1, 1000.00);

-- Usuario admin
INSERT INTO usuarios (nombre, email, password_hash, role) VALUES 
('Admin User', 'admin@example.com', '$2b$10$hash_de_ejemplo_aqui', 'ADMIN');

-- Crear cuenta para admin
INSERT INTO accounts (user_id, saldo) VALUES (2, 5000.00);
*/

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
