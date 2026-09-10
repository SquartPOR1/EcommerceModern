<?php

declare(strict_types=1);

const DB_HOST = 'localhost';
const DB_NAME = 'ecommerce';
const DB_USER = 'root';
const DB_PASSWORD = '';
const STORE_LATITUDE = -12.0464;
const STORE_LONGITUDE = -77.0428;
const STORE_NAME = 'Store warehouse, Lima';

header('Content-Type: application/json; charset=utf-8');

function jsonResponse(array $payload, int $status = 200): never
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES);
    exit;
}
