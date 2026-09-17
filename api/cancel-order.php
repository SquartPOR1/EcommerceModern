<?php

require_once __DIR__ . '/db.php';

session_start();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'POST requests only.'], 405);
}

$customerId = filter_var($_SESSION['customer']['id'] ?? null, FILTER_VALIDATE_INT);
$customerEmail = strtolower(trim((string) ($_SESSION['customer']['email'] ?? '')));
$input = json_decode(file_get_contents('php://input'), true) ?: [];
$orderId = filter_var($input['orderId'] ?? null, FILTER_VALIDATE_INT);
$reason = trim((string) ($input['reason'] ?? ''));
$note = trim((string) ($input['note'] ?? ''));
$allowedReasons = ['Changed my mind', 'Found a better price', 'Ordered by mistake', 'Delivery time is too long', 'Other'];

if (!$customerId) jsonResponse(['error' => 'Sign in to cancel an order.'], 401);
if (!$orderId || !in_array($reason, $allowedReasons, true)) {
    jsonResponse(['error' => 'Choose a valid cancellation reason.'], 422);
}
if ($reason === 'Other' && $note === '') {
    jsonResponse(['error' => 'Please tell us why you want to cancel this order.'], 422);
}

try {
    $connection = db();
    $connection->beginTransaction();
    $findOrder = $connection->prepare(
        'SELECT id, status FROM orders WHERE id = ? AND (customer_id = ? OR (customer_id IS NULL AND LOWER(email) = ?)) FOR UPDATE'
    );
    $findOrder->execute([$orderId, $customerId, $customerEmail]);
    $order = $findOrder->fetch();

    if (!$order) throw new RuntimeException('Order not found in your purchases.');
    if (!in_array($order['status'], ['pending', 'paid', 'processing'], true)) {
        throw new RuntimeException('This order can no longer be cancelled because it is already on the way or completed.');
    }

    $items = $connection->prepare('SELECT product_id, quantity FROM order_items WHERE order_id = ?');
    $items->execute([$orderId]);
    $restoreStock = $connection->prepare('UPDATE products SET stock = stock + ? WHERE id = ?');
    foreach ($items->fetchAll() as $item) {
        $restoreStock->execute([(int) $item['quantity'], (int) $item['product_id']]);
    }

    $cancel = $connection->prepare(
        'UPDATE orders SET status = ?, cancel_reason = ?, cancelled_at = CURRENT_TIMESTAMP, customer_id = ? WHERE id = ? AND (customer_id = ? OR (customer_id IS NULL AND LOWER(email) = ?))'
    );
    $cancel->execute(['cancelled', $reason . ($note !== '' ? ': ' . $note : ''), $customerId, $orderId, $customerId, $customerEmail]);
    $connection->commit();
    jsonResponse(['orderId' => $orderId, 'status' => 'cancelled', 'message' => 'Order cancelled successfully.']);
} catch (Throwable $exception) {
    if (isset($connection) && $connection->inTransaction()) $connection->rollBack();
    jsonResponse(['error' => $exception->getMessage()], 422);
}
