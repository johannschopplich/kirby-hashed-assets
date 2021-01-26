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

if (!function_exists('cssTpl')) {
    /**
     * Creates the CSS link tag if template-specific CSS exists
     *
     * @return mixed
     */
    function cssTpl()
    {
        $url = AssetUrls::handle(kirby(), '@template', [], 'css');

        if ($url !== '@template') {
            return css($url);
        }
    }
}

if (!function_exists('jsTpl')) {
    /**
     * Creates a script tag if a template-specific JS exists
     *
     * @return mixed
     */
    function jsTpl()
    {
        $url = AssetUrls::handle(kirby(), '@template', [], 'js');

        if ($url !== '@template') {
            return js($url);
        }
    }
}
