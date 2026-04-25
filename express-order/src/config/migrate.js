import mysql from "mysql2/promise";
import "dotenv/config";
const DB_NAME = process.env.DB_NAME || "order_db";
const conn = await mysql.createConnection({
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "",
  database: process.env.DB_NAME,
  multipleStatements: true,
});
await conn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
await conn.query(`USE \`${DB_NAME}\``);
await conn.execute(`
  CREATE TABLE IF NOT EXISTS orders (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    shipping_address TEXT NOT NULL,
    items JSON NOT NULL,
    total_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    status ENUM('pending','processing','shipped','delivered','cancelled') NOT NULL DEFAULT 'pending',
    payment_method ENUM('transfer','cod','ewallet','credit_card') NOT NULL,
    notes TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_email (customer_email),
    INDEX idx_order_number (order_number)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`);

console.log("Migrasi tabel orders selesai.");
await conn.end();
process.exit(0);
