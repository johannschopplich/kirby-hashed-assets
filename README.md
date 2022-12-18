# Kirby Hashed Assets

Enhances Kirby's `css()` and `js()` helpers to support hashed filenames. Pass your normal paths (e.g. `…main.js`) – the plugin will lookup hashed assets and transform the path automatically (e.g. `…main.20201226.js`). That way you can even keep asset paths identical in development and production environment!

## Key Features

- 🛷 Cache bust assets without query strings
- 🎢 **No need** for web server rewrite rules!
- ⛸ Supports `manifest.json`
- 🎿 Supports manually hashed file names
- ☃️ Create preload links with `hashedUrl()` helper

## Projects Using the Hashed Assets Plugin

- [plainkit-hashed-assets](https://github.com/johannschopplich/plainkit-hashed-assets) – a simple demonstration based on Kirby's plain kit
- [realtroll.de](https://github.com/johannschopplich/realtroll.de) – a clean website using this plugin for asset hashing

## Requirements

- Node.js
  - Optional, for file name hashing and `manifest.json` generation only.
- Kirby 3.7+
- PHP 7.4+

## Installation

### Download

Download and copy this repository to `/site/plugins/kirby-hashed-assets`.

### Git Submodule

```bash
git submodule add https://github.com/johannschopplich/kirby-hashed-assets.git site/plugins/kirby-hashed-assets
```

### Composer

```bash
composer require johannschopplich/kirby-hashed-assets
```

## Usage

### Automatic Hashing With `manifest.json`

For file hashing this plugin uses the [hashup](https://github.com/johannschopplich/hashup) npm package.

`hashup` is a tiny CLI tool with two objectives in mind for your freshly build assets:

1. Rename or rather hash (hence the name) the assets.
2. Generate a `manifest.json` for them.

You don't even have to install it to your `devDependencies`, since `npx` will fetch it once on the fly. Add hashup to your build pipeline by adding it your `package.json` scripts (recommended), for example:

```js
{
  "scripts": {
    "clean": "rm -rf public/assets/{css,js}",
    "build": "npm run clean && <...> && npx -y hashup"
  }
}
```

Now, pass asset paths to Kirby's asset helpers like you normally do:

```php
<?= js('assets/js/main.js') ?>
// `<script src="https://example.com/assets/js/main.9ad649fd.js"></script>
```

If a corresponding hashed file is found in the `manifest.json`, it will be used and rendered.

For template-specific assets, use `@template` (instead of `@auto`):

```php
<?= js('@template') ?>
// `<script src="https://example.com/assets/js/templates/home.92c6b511.js"></script>`
```

> ⚠️ If no template file exists, `https://example.com/@template` will be echoed. This will lead to HTTP errors and blocked content since the requested file doesn't exist and the error page's HTML will be returned.

If you are unsure if a template file exists, use the following helpers:

- `cssTpl()`
- `jsTpl()`

They will echo a link tag, respectively script tag, only if a template file for current page's template is present.

### Manual Hashing

For smaller websites you may prefer no build chain at all, but still want to utilize some form of asset hashing. In this use-case you can rename your files manually.

Take an imaginary `main.js` for example. Just include it like you normally would in one of your snippets:

```php
<?= js('assets/js/main.js') ?>
```

Now rename the file in the format of `main.{hash}.js`. You may use the current date, e.g.: `main.20201226.js`, which will output:

```html
<script src="https://example.com/assets/js/main.20201226.js"></script>
```

Voilà, without changing the asset path the hashed file will be found and rendered in your template!

### Hashed Filenames for Preloading Links

You can use the global `hashedUrl()` helper to lookup a file like you normally would with the `css()` or `js()` helpers. While the latter return a link or respectively script tag, the `hashedUrl()` helper will only return a URL which you can use in any context.

```php
<link rel="preload" href="<?= hashedUrl('assets/css/templates/default.css') ?>" as="style">
// <link rel="preload" href="/assets/css/templates/default.1732900e.css" as="style">
```

Since all evergreen browsers finally support JavaScript modules natively, you may prefer preloading modules:

```php
<link rel="modulepreload" href="<?= hashedUrl('assets/js/templates/home.js') ?>">
// <link rel="preload" href="/assets/js/templates/home.92c6b511.js">
```

## License

[MIT](./LICENSE) License © 2021-2022 [Johann Schopplich](https://github.com/johannschopplich)
