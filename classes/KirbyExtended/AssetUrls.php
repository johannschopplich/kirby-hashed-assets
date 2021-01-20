<?php

namespace KirbyExtended;

use Kirby\Cms\Url;
use Kirby\Data\Json;
use Kirby\Toolkit\F;
use Kirby\Toolkit\Str;

class AssetUrls
{
    protected static array $manifest;

    /**
     * Get manifest containing hashed filenames
     *
     * @return array
     */
    public static function useManifest(): array
    {
        if (isset(static::$manifest)) {
            return static::$manifest;
        }

        $manifestPath = kirby()->root('assets') . '/manifest.json';

        static::$manifest = F::exists($manifestPath)
            ? Json::decode(F::read($manifestPath))
            : [];

        return static::$manifest;
    }

    /**
     * Returns the hashed URL for a CSS asset if present
     *
     * @param array $args
     * @return string
     */
    public static function css(...$args): string
    {
        $args[] = 'css';
        return static::handle(...$args);
    }

    /**
     * Returns the hashed URL for a JS asset if present
     *
     * @param array $args
     * @return string
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

        $path = Url::path($url, true);
        $assetsDir = Str::ltrim($kirby->root('assets'), kirby()->root());

        // Build path to template asset
        if ($url === '@template') {
            $path = "{$assetsDir}/{$extension}/templates/" . $kirby->site()->page()->template()->name() . ".{$extension}";
        }

        $absolutePath = $kirby->root() . $path;

        // Check if the unhashed file exists before looking it up in the manifest
        if (F::exists($absolutePath)) {
            $filePath = Str::ltrim($absolutePath, $kirby->root());
            return $filePath;
        }

        // Check if the manifest contains the given file
        if (array_key_exists($path, static::useManifest())) {
            return static::useManifest()[$path];
        }

        // Replace trailing `.{extension}` extension with `[.-]*.{extension}`,
        // with the asterix representing a hash to look for
        $patternPath = preg_replace('/(\.' . $extension . ')$/', '[.-]*$1', $absolutePath);

        // Find a hashed file outside of a manifest
        $fileMatch = glob($patternPath);
        if (!empty($fileMatch)) {
            $filePath = Str::ltrim($fileMatch[0], $kirby->root());
            return $filePath;
        }

        return $url;
    }
}
