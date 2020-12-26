<?php

@include_once __DIR__ . '/vendor/autoload.php';

use Kirby\Cms\App as Kirby;
use KirbyExtended\AssetHashes;

Kirby::plugin('johannschopplich/kirby-hashed-assets', [
    'components' => [
        'css' => [AssetHashes::class, 'handle'],
        'js' => [AssetHashes::class, 'handle']
    ]
]);
