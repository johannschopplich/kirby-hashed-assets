<?php

namespace JohannSchopplich;

use Kirby\Cms\Url;
use Kirby\Data\Data;
use Kirby\Filesystem\F;
use Kirby\Toolkit\Str;

class AssetUrls
{
    protected static array $manifest;

    /**
     * Get manifest containing hashed filenames
     */
    public static function useManifest(): array
    {
        if (isset(static::$manifest)) {
            return static::$manifest;
        }

        $manifestPath = kirby()->root('assets') . '/manifest.json';

        static::$manifest = F::exists($manifestPath)
            ? Data::read($manifestPath)
            : [];

        return static::$manifest;
    }

    /**
     * Returns the hashed URL for a CSS asset if present
     */
    public static function css(...$args): string
    {
        $args[] = 'css';
        return static::handle(...$args);
    }

    /**
     * Returns the hashed URL for a JS asset if present
     */
    public static function js(...$args): string
    {
        $args[] = 'js';
        return static::handle(...$args);
    }

    /**
     * Parse CSS or JS URL
     *
     * @param \Kirby\Cms\App $kirby Kirby instance
     * @param string $url Relative or absolute URL
     * @param string|array $options An array of attributes for the link tag or a media attribute string
     * @param string $extension The asset's extension
     * @return string
     */
    public static function handle(\Kirby\Cms\App $kirby, string $url, $options, string $extension): string
    {
        // Bail if URL is absolute
        if (Url::isAbsolute($url)) {
            return $url;
        }

        $path = Url::path($url);

        // Build path to template asset
        if ($url === '@template') {
            $path = "assets/{$extension}/templates/" . $kirby->site()->page()->template()->name() . ".{$extension}";
        }

        // Check if the unhashed file exists before looking it up in the manifest
        if (F::exists($path, $kirby->root())) {
            return '/' . $path;
        }

        // Check if the manifest contains the given file
        if (array_key_exists($path, static::useManifest())) {
            return '/' . static::useManifest()[$path];
        }

        // Replace trailing `.{extension}` extension with `.*.{extension}`,
        // with the asterix representing a hash to look for
        $patternPath = preg_replace(
            '/(\.' . $extension . ')$/',
            '.*$1',
            $kirby->root() . '/' . $path
        );

        // Find a hashed file outside of a manifest
        $fileMatch = glob($patternPath);
        if (!empty($fileMatch)) {
            $filePath = Str::ltrim($fileMatch[0], $kirby->root());
            return $filePath;
        }

        return $url;
    }
}
