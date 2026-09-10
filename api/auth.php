<?php

require_once __DIR__ . '/db.php';

session_start();

function authResponse(?array $user = null, int $status = 200, ?string $error = null): never
{
    $payload = $error ? ['error' => $error] : ['user' => $user];
    jsonResponse($payload, $status);
}

function currentUser(): ?array
{
    return $_SESSION['customer'] ?? null;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    authResponse(currentUser());
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    authResponse(null, 405, 'POST requests only.');
}

$input = json_decode(file_get_contents('php://input'), true) ?: [];
$action = (string) ($input['action'] ?? '');
$email = strtolower(trim((string) ($input['email'] ?? '')));
$password = (string) ($input['password'] ?? '');

try {
    $connection = db();

    if ($action === 'logout') {
        $_SESSION = [];
        session_destroy();
        authResponse(null);
    }

    if (!in_array($action, ['register', 'login'], true)) {
        authResponse(null, 422, 'Choose register, login, or logout.');
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($password) < 8) {
        authResponse(null, 422, 'Enter a valid email and a password with at least 8 characters.');
    }

    if ($action === 'register') {
        $name = trim((string) ($input['name'] ?? ''));
        if ($name === '') authResponse(null, 422, 'Enter your full name.');

        $createCustomer = $connection->prepare(
            'INSERT INTO customers (name, email, password_hash) VALUES (?, ?, ?)'
        );
        try {
            $createCustomer->execute([$name, $email, password_hash($password, PASSWORD_DEFAULT)]);
            $customerId = (int) $connection->lastInsertId();
        } catch (PDOException $exception) {
            if ((int) $exception->errorInfo[1] === 1062) {
                authResponse(null, 409, 'An account with that email already exists.');
            }
            throw $exception;
        }
    } else {
        $findCustomer = $connection->prepare(
            'SELECT id, name, email, password_hash FROM customers WHERE email = ?'
        );
        $findCustomer->execute([$email]);
        $customer = $findCustomer->fetch();
        if (!$customer || !password_verify($password, $customer['password_hash'])) {
            authResponse(null, 401, 'Email or password is incorrect.');
        }
        $customerId = (int) $customer['id'];
        $name = $customer['name'];
    }

    session_regenerate_id(true);
    $_SESSION['customer'] = [
        'id' => $customerId,
        'name' => $name,
        'email' => $email,
    ];
    authResponse($_SESSION['customer'], $action === 'register' ? 201 : 200);
} catch (Throwable $exception) {
    authResponse(null, 500, 'Authentication is temporarily unavailable.');
}