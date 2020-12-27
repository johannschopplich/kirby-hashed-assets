<?php

@include_once __DIR__ . '/vendor/autoload.php';

use Kirby\Cms\App as Kirby;
use KirbyExtended\AssetHashes;

Kirby::plugin('johannschopplich/kirby-hashed-assets', [
    'components' => [
        'css' => [AssetHashes::class, 'css'],
        'js' => [AssetHashes::class, 'js']
    ]
]);
