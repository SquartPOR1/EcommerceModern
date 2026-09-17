<?php

require_once __DIR__ . '/db.php';

session_start();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['error' => 'GET requests only.'], 405);
}

$customerId = filter_var($_SESSION['customer']['id'] ?? null, FILTER_VALIDATE_INT);
$customerEmail = strtolower(trim((string) ($_SESSION['customer']['email'] ?? '')));
if (!$customerId) {
    jsonResponse(['error' => 'Sign in to view your purchases.'], 401);
}

try {
    $connection = db();
    $ordersQuery = $connection->prepare(
        'SELECT id, total, status, courier_id, cancel_reason, created_at FROM orders WHERE customer_id = ? OR (customer_id IS NULL AND LOWER(email) = ?) ORDER BY created_at DESC, id DESC'
    );
    $ordersQuery->execute([$customerId, $customerEmail]);
    $orders = $ordersQuery->fetchAll();

    $itemsQuery = $connection->prepare(
        'SELECT order_id, product_id, product_name, price, quantity FROM order_items WHERE order_id = ? ORDER BY id'
    );

    $result = [];
    foreach ($orders as $order) {
        $itemsQuery->execute([(int) $order['id']]);
        $items = array_map(static function (array $item): array {
            return [
                'productId' => (int) $item['product_id'],
                'name' => $item['product_name'],
                'price' => (float) $item['price'],
                'quantity' => (int) $item['quantity'],
            ];
        }, $itemsQuery->fetchAll());

        $result[] = [
            'id' => (int) $order['id'],
            'total' => (float) $order['total'],
            'status' => $order['status'],
            'hasCourier' => !empty($order['courier_id']),
            'cancelReason' => $order['cancel_reason'],
            'createdAt' => $order['created_at'],
            'items' => $items,
        ];
    }

    jsonResponse(['orders' => $result]);
} catch (Throwable $exception) {
    jsonResponse(['error' => 'Purchases could not be loaded.'], 500);
}
