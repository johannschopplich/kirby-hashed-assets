<?php

require __DIR__ . '/helpers.php';

load([
    'KirbyExtended\\AssetUrls' => 'classes/KirbyExtended/AssetUrls.php'
], __DIR__);

\Kirby\Cms\App::plugin('johannschopplich/kirby-hashed-assets', [
    'components' => [
        'css' => [\KirbyExtended\AssetUrls::class, 'css'],
        'js' => [\KirbyExtended\AssetUrls::class, 'js']
    ]
]);
