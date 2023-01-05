<?php

use JohannSchopplich\AssetUrls;

load([
    'JohannSchopplich\\AssetUrls' => 'AssetUrls.php'
], __DIR__);

require __DIR__ . '/helpers.php';

\Kirby\Cms\App::plugin('johannschopplich/hashed-assets', [
    'components' => [
        'css' => [AssetUrls::class, 'css'],
        'js' => [AssetUrls::class, 'js']
    ]
]);
