<?php

require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'POST requests only.'], 405);
}

$input = json_decode(file_get_contents('php://input'), true) ?: [];
$budgetPhp = filter_var($input['budget'] ?? null, FILTER_VALIDATE_FLOAT);
$style = strtolower(trim((string) ($input['style'] ?? '')));
$occasion = strtolower(trim((string) ($input['occasion'] ?? '')));
$color = strtolower(trim((string) ($input['color'] ?? '')));

if ($budgetPhp === false || $budgetPhp < 1) {
    jsonResponse(['error' => 'Choose a valid budget.'], 422);
}

$budgetUsd = $budgetPhp / 58;
$preferences = trim($style . ' ' . $occasion . ' ' . $color);

$keywordGroups = [
    'formal' => ['jazzmaster', 'rose', 'gold', 'dreyfuss', 'portuguese', 'longines'],
    'classic' => ['jazzmaster', 'ingersoll', 'longines', 'portuguese'],
    'sport' => ['khaki', 'pilot', 'spirit'],
    'modern' => ['black', 'duchen', 'fosil', 'jubilee'],
    'gold' => ['gold', 'rose', 'dreyfuss', 'portuguese'],
    'black' => ['black', 'duchen', 'jubilee'],
    'silver' => ['jazzmaster', 'ingersoll', 'khaki', 'spirit'],
    'everyday' => ['ingersoll', 'khaki', 'duchen', 'fosil'],
    'gift' => ['rose', 'gold', 'jazzmaster', 'longines'],
];

try {
    $products = db()->query(
        'SELECT id, name, price, image, category, stock, description FROM products WHERE stock > 0'
    )->fetchAll();
    $matches = [];

    foreach ($products as $product) {
        $price = (float) $product['price'];
        $productText = strtolower($product['name'] . ' ' . $product['category'] . ' ' . ($product['description'] ?? ''));
        $score = $price <= $budgetUsd ? 4 : max(0, 4 - (($price - $budgetUsd) / max($budgetUsd, 1)) * 4);

        foreach ($keywordGroups as $keyword => $terms) {
            if (str_contains($preferences, $keyword)) {
                foreach ($terms as $term) {
                    if (str_contains($productText, $term)) $score += 3;
                }
            }
        }

        $matches[] = [
            'id' => (int) $product['id'],
            'name' => $product['name'],
            'price' => $price,
            'pricePhp' => round($price * 58, 2),
            'image' => $product['image'],
            'category' => $product['category'],
            'reason' => $price <= $budgetUsd
                ? 'Fits comfortably within your budget.'
                : 'A little above budget, but worth considering for its style.',
            'score' => $score,
        ];
    }

    usort($matches, fn(array $first, array $second): int => $second['score'] <=> $first['score']);
    $matches = array_slice($matches, 0, 3);
    foreach ($matches as &$match) unset($match['score']);

    jsonResponse(['products' => $matches]);
} catch (Throwable $exception) {
    jsonResponse(['error' => 'Recommendations could not be loaded.'], 500);
}