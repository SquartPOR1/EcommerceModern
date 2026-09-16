<?php

require_once __DIR__ . '/db.php';

session_start();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'POST requests only.'], 405);
}

$input = json_decode(file_get_contents('php://input'), true);
$customer = $_SESSION['customer'] ?? null;
$name = trim((string) ($customer['name'] ?? ''));
$email = trim((string) ($customer['email'] ?? ''));
$customerId = filter_var($customer['id'] ?? null, FILTER_VALIDATE_INT);
$address = trim((string) ($input['address'] ?? ''));
$latitude = filter_var($input['latitude'] ?? null, FILTER_VALIDATE_FLOAT);
$longitude = filter_var($input['longitude'] ?? null, FILTER_VALIDATE_FLOAT);
$items = $input['items'] ?? [];

if (!$customerId || $name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || $address === '' || !is_array($items) || $items === []) {
    jsonResponse(['error' => 'Please log in before placing an order.'], 401);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || $address === '' || !is_array($items) || $items === []) {
    jsonResponse(['error' => 'Name, valid email, address, and cart items are required.'], 422);
}

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
    if ($response === false) return null;

    $results = json_decode($response, true);
    if (!is_array($results) || empty($results[0]['lat']) || empty($results[0]['lon'])) return null;

    return [
        'latitude' => (float) $results[0]['lat'],
        'longitude' => (float) $results[0]['lon'],
    ];
}

function createCourierDelivery(string $address): ?string
{
    $data = courierRequest('POST', '/order', [
        'from' => STORE_NAME,
        'to' => $address,
    ]);
    return is_array($data) && !empty($data['id']) ? (string) $data['id'] : null;
}

try {
    $connection = db();
    $connection->beginTransaction();
    $location = $latitude !== false && $longitude !== false
        && $latitude >= -90 && $latitude <= 90 && $longitude >= -180 && $longitude <= 180
        ? ['latitude' => $latitude, 'longitude' => $longitude]
        : geocodeAddress($address);
    $findProduct = $connection->prepare('SELECT id, name, price, stock FROM products WHERE id = ? FOR UPDATE');
    $total = 0.0;
    $validatedItems = [];

    foreach ($items as $item) {
        $productId = filter_var($item['id'] ?? null, FILTER_VALIDATE_INT);
        $quantity = filter_var($item['quantity'] ?? null, FILTER_VALIDATE_INT);
        if (!$productId || !$quantity || $quantity < 1) {
            throw new RuntimeException('Invalid cart item.');
        }

        $findProduct->execute([$productId]);
        $product = $findProduct->fetch();
        if (!$product || (int) $product['stock'] < $quantity) {
            throw new RuntimeException('One or more products are out of stock.');
        }

        $price = (float) $product['price'];
        $total += $price * $quantity;
        $validatedItems[] = [$product, $quantity, $price];
    }

    $createOrder = $connection->prepare(
        'INSERT INTO orders (customer_id, customer_name, email, address, customer_latitude, customer_longitude, total) VALUES (?, ?, ?, ?, ?, ?, ?)'
    );
    $createOrder->execute([
        $customerId,
        $name,
        $email,
        $address,
        $location['latitude'] ?? null,
        $location['longitude'] ?? null,
        number_format($total, 2, '.', ''),
    ]);
    $orderId = (int) $connection->lastInsertId();
    $createItem = $connection->prepare(
        'INSERT INTO order_items (order_id, product_id, product_name, price, quantity) VALUES (?, ?, ?, ?, ?)'
    );
    $reduceStock = $connection->prepare('UPDATE products SET stock = stock - ? WHERE id = ?');

    foreach ($validatedItems as [$product, $quantity, $price]) {
        $createItem->execute([$orderId, $product['id'], $product['name'], $price, $quantity]);
        $reduceStock->execute([$quantity, $product['id']]);
    }

    $connection->commit();
    $courierId = createCourierDelivery($address);
    if ($courierId) {
        $saveCourier = $connection->prepare('UPDATE orders SET courier_id = ? WHERE id = ?');
        $saveCourier->execute([$courierId, $orderId]);
    }
    jsonResponse([
        'orderId' => $orderId,
        'courierId' => $courierId,
        'total' => round($total, 2),
        'message' => 'Order created successfully.',
    ], 201);
} catch (Throwable $exception) {
    if (isset($connection) && $connection->inTransaction()) {
        $connection->rollBack();
    }
    jsonResponse(['error' => $exception->getMessage()], 422);
}
