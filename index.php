<?php

load([
    'KirbyExtended\\AssetUrls' => 'classes/KirbyExtended/AssetUrls.php'
], __DIR__);

require __DIR__ . '/helpers.php';

\Kirby\Cms\App::plugin('johannschopplich/kirby-hashed-assets', [
    'components' => [
        'css' => [\KirbyExtended\AssetUrls::class, 'css'],
        'js' => [\KirbyExtended\AssetUrls::class, 'js']
    ]
]);
