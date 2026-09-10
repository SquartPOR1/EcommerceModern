<?php

require_once __DIR__ . '/db.php';

try {
    $products = db()->query(
        'SELECT id, name, slug, price, image, category, stock, description FROM products WHERE stock > 0 ORDER BY id'
    )->fetchAll();

    foreach ($products as &$product) {
        $product['id'] = (int) $product['id'];
        $product['price'] = (float) $product['price'];
        $product['stock'] = (int) $product['stock'];
    }

    jsonResponse(['products' => $products]);
} catch (Throwable $exception) {
    jsonResponse(['error' => 'Products could not be loaded.'], 500);
}
