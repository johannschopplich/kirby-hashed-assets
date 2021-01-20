<?php

use KirbyExtended\AssetUrls;

if (!function_exists('hashedUrl')) {
    /**
     * Returns the URL of a hashed asset if present
     *
     * @param string $url Relative or absolute URL
     * @return string
     */
    function hashedUrl(string $url): string
    {
        $extension = pathinfo($url, PATHINFO_EXTENSION);
        return AssetUrls::handle(kirby(), $url, [], $extension);
    }
}
