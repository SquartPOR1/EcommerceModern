USE ecommerce;

SET @courier_column_exists = (
	SELECT COUNT(*)
	FROM information_schema.COLUMNS
	WHERE TABLE_SCHEMA = DATABASE()
	  AND TABLE_NAME = 'orders'
	  AND COLUMN_NAME = 'courier_id'
);
SET @courier_column_sql = IF(
	@courier_column_exists = 0,
	'ALTER TABLE orders ADD COLUMN courier_id VARCHAR(64) NULL AFTER status',
	'SELECT 1'
);
PREPARE courier_column_statement FROM @courier_column_sql;
EXECUTE courier_column_statement;
DEALLOCATE PREPARE courier_column_statement;