<?php

use Kirby\Cms\App;
use KirbyExtended\AssetHashes;
use PHPUnit\Framework\TestCase;

class AssetHashesTest extends TestCase
{
    protected $kirby;

    public function setUp(): void
    {
        $this->kirby = new App([
            'roots' => [
                'index' => __DIR__ . '/fixtures'
            ],
            'components' => [
                'css' => [AssetHashes::class, 'handle'],
                'js' => [AssetHashes::class, 'handle']
            ]
        ]);
    }

    public function testAbsolutePath()
    {
        $expected = '<link href="https://example.com/main.css" rel="stylesheet">';
        $this->assertEquals($expected, css('https://example.com/main.css'));
    }

    public function testManifestJsPath()
    {
        $expected = '<link href="/assets/css/main.1732900e.css" rel="stylesheet">';
        $this->assertEquals($expected, css('assets/css/main.css'));
    }

    public function testManifestCssPath()
    {
        $expected = '<script src="/assets/js/main.9ad649fd.js"></script>';
        $this->assertEquals($expected, js('assets/js/main.js'));
    }

    public function testExistingUnhashedFile()
    {
        $expected = '<script src="/assets/js/unhashed.js"></script>';
        $this->assertEquals($expected, js('assets/js/unhashed.js'));
    }

    public function testExistingHashedFile()
    {
        $expected = '<script src="/assets/js/hashed.20201225.js"></script>';
        $this->assertEquals($expected, js('assets/js/hashed.js'));
    }
}
