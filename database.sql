CREATE DATABASE IF NOT EXISTS ecommerce CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ecommerce;

CREATE TABLE IF NOT EXISTS products (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  slug VARCHAR(140) NOT NULL UNIQUE,
  price DECIMAL(10,2) NOT NULL,
  image VARCHAR(255) NOT NULL,
  category VARCHAR(80) NOT NULL DEFAULT 'watches',
  stock INT UNSIGNED NOT NULL DEFAULT 0,
  description TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS orders (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL,
  address TEXT NOT NULL,
  customer_latitude DECIMAL(10,7) NULL,
  customer_longitude DECIMAL(10,7) NULL,
  total DECIMAL(10,2) NOT NULL,
  status ENUM('pending','paid','processing','shipped','cancelled') NOT NULL DEFAULT 'pending',
  payment_reference VARCHAR(190) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS order_items (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT UNSIGNED NOT NULL,
  product_id INT UNSIGNED NOT NULL,
  product_name VARCHAR(120) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  quantity INT UNSIGNED NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB;

INSERT INTO products (name, slug, price, image, category, stock) VALUES
('Jazzmaster', 'jazzmaster', 1050.00, 'assets/img/featured1.png', 'featured', 10),
('Ingersoll', 'ingersoll', 250.00, 'assets/img/featured2.png', 'featured', 10),
('Rose gold', 'rose-gold', 890.00, 'assets/img/featured3.png', 'featured', 10),
('Spirit rose', 'spirit-rose', 1500.00, 'assets/img/product1.png', 'products', 10),
('Khaki pilot', 'khaki-pilot', 1350.00, 'assets/img/product2.png', 'products', 10),
('Jubilee black', 'jubilee-black', 870.00, 'assets/img/product3.png', 'products', 10),
('Fosil me3', 'fosil-me3', 650.00, 'assets/img/product4.png', 'products', 10),
('Duchen', 'duchen', 950.00, 'assets/img/product5.png', 'products', 10),
('Longines rose', 'longines-rose', 980.00, 'assets/img/new1.png', 'new', 10),
('Jazzmaster new', 'jazzmaster-new', 1150.00, 'assets/img/new2.png', 'new', 10),
('Dreyfuss gold', 'dreyfuss-gold', 750.00, 'assets/img/new3.png', 'new', 10),
('Portuguese rose', 'portuguese-rose', 1590.00, 'assets/img/new4.png', 'new', 10)
ON DUPLICATE KEY UPDATE name = VALUES(name), price = VALUES(price), image = VALUES(image);
