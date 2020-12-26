<?php

namespace KirbyExtended;

use Kirby\Cms\Url;
use Kirby\Data\Json;
use Kirby\Toolkit\F;
use Kirby\Toolkit\Str;

class AssetHashes
{
    /**
     * Manifest containing hashed filenames
     *
     * @var array|null
     */
    protected static ?array $manifest = null;

    /**
     * Get and cache static `$manifest`
     *
     * @return array
     */
    public static function useManifest(): array
    {
        if (static::$manifest !== null) {
            return static::$manifest;
        }

        $manifestPath = kirby()->root('assets') . '/manifest.json';

        static::$manifest = F::exists($manifestPath)
            ? Json::decode(F::read($manifestPath))
            : [];

        return static::$manifest;
    }

    /**
     * Handle CSS or JS asset
     *
     * @param \Kirby\Cms\App $kirby Kirby instance
     * @param string $url Relative or absolute URL
     * @param string|array $options An array of attributes for the link tag or a media attribute string
     * @return string
     */
    public static function handle(\Kirby\Cms\App $kirby, string $url, $options): string
    {
        // Bail if URL is absolute
        if (Url::isAbsolute($url)) {
            return $url;
        }

        $path = Url::path($url, true);
        $extension = pathinfo($url, PATHINFO_EXTENSION);
        $assetsDir = Str::ltrim($kirby->root('assets'), kirby()->root());
        $absolutePath = $kirby->root() . $path;

        // Build path to template asset
        if ($url === '@template') {
            $path = "{$assetsDir}/{$extension}/templates/" . $kirby->site()->page()->template()->name() . ".{$extension}";
        }

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
        $patternPath = preg_replace('/(\.' . $extension . ')+$/', '[.-]*$1', $absolutePath);

        // Find a hashed file outside of a manifest
        $fileMatch = glob($patternPath);
        if (!empty($fileMatch)) {
            $filePath = Str::ltrim($fileMatch[0], $kirby->root());
            return $filePath;
        }

        return $url;
    }
}
