USE ecommerce;

ALTER TABLE orders ADD COLUMN cancel_reason VARCHAR(255) NULL AFTER courier_id;
ALTER TABLE orders ADD COLUMN cancelled_at TIMESTAMP NULL AFTER cancel_reason;