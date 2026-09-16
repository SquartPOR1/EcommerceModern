<?php

require_once __DIR__ . '/db.php';

function geocodeAddress(string $address): ?array
{
    $url = 'https://nominatim.openstreetmap.org/search?' . http_build_query([
        'q' => $address,
        'format' => 'jsonv2',
        'limit' => 1,
    ]);
    $context = stream_context_create([
        'http' => [
            'timeout' => 8,
            'header' => "User-Agent: ResponsiveWatchesStore/1.0\r\n",
        ],
    ]);
    $response = @file_get_contents($url, false, $context);
    $results = $response === false ? null : json_decode($response, true);
    if (!is_array($results) || empty($results[0]['lat']) || empty($results[0]['lon'])) return null;
    return ['latitude' => (float) $results[0]['lat'], 'longitude' => (float) $results[0]['lon']];
}

function getCourierDetails(?string $courierId): ?array
{
    if (!$courierId) return null;
    return courierRequest('GET', '/couriers/' . rawurlencode($courierId));
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['error' => 'GET requests only.'], 405);
}

$orderId = filter_input(INPUT_GET, 'order', FILTER_VALIDATE_INT);
$email = trim((string) ($_GET['email'] ?? ''));

if (!$orderId || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse(['error' => 'Enter a valid order number and email address.'], 422);
}

try {
    $connection = db();
    $query = $connection->prepare(
        'SELECT id, address, total, status, courier_id, created_at, customer_latitude, customer_longitude FROM orders WHERE id = ? AND email = ?'
    );
    $query->execute([$orderId, $email]);
    $order = $query->fetch();

    if (!$order) {
        jsonResponse(['error' => 'No order matched that number and email address.'], 404);
    }

    if ($order['customer_latitude'] === null || $order['customer_longitude'] === null) {
        $location = geocodeAddress($order['address']);
        if ($location) {
            $saveLocation = $connection->prepare(
                'UPDATE orders SET customer_latitude = ?, customer_longitude = ? WHERE id = ?'
            );
            $saveLocation->execute([$location['latitude'], $location['longitude'], $order['id']]);
            $order['customer_latitude'] = $location['latitude'];
            $order['customer_longitude'] = $location['longitude'];
        }
    }

    jsonResponse([
        'order' => [
            'id' => (int) $order['id'],
            'total' => (float) $order['total'],
            'status' => $order['status'],
            'courier' => getCourierDetails($order['courier_id']),
            'createdAt' => $order['created_at'],
            'latitude' => $order['customer_latitude'] === null ? null : (float) $order['customer_latitude'],
            'longitude' => $order['customer_longitude'] === null ? null : (float) $order['customer_longitude'],
        ],
    ]);
} catch (Throwable $exception) {
    jsonResponse(['error' => 'Order status could not be loaded.'], 500);
}
