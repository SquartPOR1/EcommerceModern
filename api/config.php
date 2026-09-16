<?php

declare(strict_types=1);

const DB_HOST = 'localhost';
const DB_NAME = 'ecommerce';
const DB_USER = 'root';
const DB_PASSWORD = '';
const STORE_LATITUDE = 14.5995;
const STORE_LONGITUDE = 120.9842;
const STORE_NAME = 'Store warehouse, Manila, Philippines';
const COURIER_SIMULATION_URL = 'http://localhost:3000';

header('Content-Type: application/json; charset=utf-8');

function jsonResponse(array $payload, int $status = 200): never
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES);
    exit;
}

function courierRequest(string $method, string $path, ?array $payload = null): ?array
{
    $headers = ['Accept: application/json'];
    $options = [
        'http' => [
            'method' => $method,
            'timeout' => 8,
            'ignore_errors' => true,
            'header' => $headers,
        ],
    ];
    if ($payload !== null) {
        $options['http']['content'] = json_encode($payload);
        $options['http']['header'][] = 'Content-Type: application/json';
    }

    $response = @file_get_contents(rtrim(COURIER_SIMULATION_URL, '/') . '/' . ltrim($path, '/'), false, stream_context_create($options));
    if ($response === false) return null;

    $statusLine = $http_response_header[0] ?? '';
    preg_match('/\s(\d{3})\s/', $statusLine, $matches);
    $status = (int) ($matches[1] ?? 0);
    if ($status < 200 || $status >= 300) return null;

    $data = json_decode($response, true);
    return is_array($data) ? $data : null;
}
