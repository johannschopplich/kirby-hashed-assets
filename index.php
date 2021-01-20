<?php

@include_once __DIR__ . '/vendor/autoload.php';

use Kirby\Cms\App as Kirby;
use KirbyExtended\AssetUrls;

Kirby::plugin('johannschopplich/kirby-hashed-assets', [
    'components' => [
        'css' => [AssetUrls::class, 'css'],
        'js' => [AssetUrls::class, 'js']
    ]
]);
