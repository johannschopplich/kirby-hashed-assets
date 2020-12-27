# Kirby Hashed Assets

Use hashed assets with the `css()` and `js()` helpers without changing the asset paths passed.

## Key features

- 🛷 Cache bust assets without query strings
- ⛸ Supports `manifest.json`
- 🎿 Supports manually hashed file names

## Requirements

- Node.js
  - Optional, for file name hashing and `manifest.json` generation only.
- Kirby 3
- PHP 7.4+

## Installation

### Download

Download and copy this repository to `/site/plugins/kirby-hashed-assets`.

### Git submodule

```
git submodule add https://github.com/johannschopplich/kirby-hashed-assets.git site/plugins/kirby-hashed-assets
```

### Composer

```
composer require johannschopplich/kirby-hashed-assets
```

## Usage

### Automatic hashing with `manifest.json`

> Head over to the [https://github.com/johannschopplich/plainkit-hashed-assets](plainkit-hashed-assets) repository to see a complete build setup in action.

To rename unhashed CSS and JS assets inside the `assets` directory after each build and generate an asset `manifest.json`, execute the [`hashBuildAssets.js`](scripts/hashBuildAssets.js) script. You can copy it to your build 

You may add the following npm script to hash file names and generate the manifest after each build iteration automatically:

```js
{
  "scripts": {
    "clean": "rm -rf public/assets/{css,js}",
    "assets:build": "...",
    "assets:hash": "node site/plugins/kirby-hashed-assets/scripts/hashBuildAssets.js",
    "build": "npm run clean && npm run assets:build && npm run assets:hash"
  }
}
```

Now pass asset paths to Kirby's asset helpers like you normally would:

```php
<?= js('assets/js/main.js') ?>
// Example output: `<script src="https://example.com/assets/js/main.9ad649fd.js"></script>
```

If a corresponding hashed file is found in the `manifest.json`, it will be used and rendered.

For template-specific assets, use `@template` (instead of `@auto`):

```php
<?= js('@template') ?>
// Example output: `<script src="https://example.com/assets/js/templates/home.92c6b511.js"></script>`
```

### Manual hashing

For smaller websites you may prefer no build chain at all, but still want to utilize some form of asset hashing. In this use-case you can rename your files manually.

Take an imaginary `main.js` for example. Just include it like you normally would in one of your snippets:

```php
<?= js('assets/js/main.js') ?>
```

Now rename the file in the format of `main.{hash}.js`. You may use the current date, e.g.: `main.20201226.js`. Example output:

```html
<script src="https://example.com/assets/js/main.20201226.js"></script>
```

Voilà, without changing the asset path the hashed file will be found and rendered in your template!

## License

[MIT](https://opensource.org/licenses/MIT)
