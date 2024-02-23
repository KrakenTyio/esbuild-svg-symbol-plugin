# Esbuild svg symbol plugin

Inspired logic for Esbuild runtime loading and rendering of SVG as symbols
from [SVG sprite loader](https://github.com/JetBrains/svg-sprite-loader). Contain only runtime part, not sprite
extraction.

## Table of contents

- [Why it's cool](#why-its-cool)
- [Installation](#installation)
- [Configuration](#configuration)
    - [`esModule`](#es-module)
    - [Runtime configuration](#runtime-configuration)
        - [`spriteModule`](#sprite-module)
        - [`symbolModule`](#symbol-module)
        - [`runtimeGenerator`](#runtime-generator)
- [License](#license)
- [Credits](#credits)

## Why it's cool

- **Minimum initial configuration**. Most of the options are configured automatically.
- **Runtime for browser**. Sprites are rendered and injected in pages automatically, you just refer to images
  via `<svg><use xlink:href="#id"></use></svg>`.
- **Isomorphic runtime for node/browser**. Can render sprites on server or in browser manually.
- **Customizable**. Write/extend runtime module to implement custom sprite behaviour. Write/extend runtime generator to
  produce your own runtime, e.g. React component configured with imported symbol.

## Installation

```bash
npm install esbuild-svg-symbol-plugin -D
# via yarn
yarn add esbuild-svg-symbol-plugin -D
```

## Configuration

```js
// esbuild
esbuild.build({
    entryPoints: ['src/index.js'],
    bundle: true,
    outfile: 'dist/bundle.js',
    plugins: [
        svgSymbolLoaderPlugin(config) // options are documented below
    ],
}).catch(e => (console.error(e), process.exit(1)))
```

<a id="es-module"></a>

### `esModule` (default `true`, autoconfigured)

Generated export format:

- when `true` loader will produce `export default ...`.
- when `false` the result is `module.exports = ...`.

By default depends on used webpack version: `true` for webpack >= 2, `false` otherwise.

## Runtime configuration

When you require an image, loader transforms it to SVG `<symbol>`, adds it to the special sprite storage and returns
class instance
that represents symbol. It contains `id`, `viewBox` and `content` (`id`, `viewBox` and `url` in extract mode)
fields and can later be used for referencing the sprite image, e.g:

```js
import twitterLogo from './logos/twitter.svg';
// twitterLogo === SpriteSymbol<id: string, viewBox: string, content: string>
// Extract mode: SpriteSymbol<id: string, viewBox: string, url: string, toString: Function>

const rendered = `
<svg viewBox="${twitterLogo.viewBox}">
  <use xlink:href="#${twitterLogo.id}" />
</svg>`;
```

or for dynamic imports:

```js
const dynamicIcon = await import(`./logos/${icon}.svg`);
const rendered = `
<svg viewBox="${dynamicIcon.viewBox}">
<use xlink:href="#${dynamicIcon.id}" />
</svg>`;
```

When browser event `DOMContentLoaded` is fired, sprite will be automatically rendered and injected in
the `document.body`.
If custom behaviour is needed (e.g. a different mounting target) default sprite module could be overridden
via `spriteModule` option. Check example below.

<a id="sprite-module"></a>

### `spriteModule` (autoconfigured)

Path to sprite module that will be compiled and executed at runtime.
By default it depends on [`target`](https://webpack.js.org/configuration/target) webpack config option:

- `esbuild-svg-symbol-plugin/runtime/browser-sprite.build` for 'web' target.
- `esbuild-svg-symbol-plugin/runtime/sprite.build` for other targets.

If you need custom behavior, use this option to specify a path of your sprite implementation module.
Path will be resolved relative to the current webpack build folder, e.g. `utils/sprite.js` placed in current project dir
should be written as `./utils/sprite`.

Example of sprite with custom mounting target (copypasted
from [browser-sprite](https://github.com/JetBrains/svg-sprite-loader/blob/master/runtime/browser-sprite.js)):

```js
import BrowserSprite from 'svg-baker-runtime/src/browser-sprite';
import domready from 'domready';

const sprite = new BrowserSprite();
domready(() => sprite.mount('#my-custom-mounting-target'));

export default sprite; // don't forget to export!
```

<a id="symbol-module"></a>

### `symbolModule` (autoconfigured)

Same as `spriteModule`, but for sprite symbol. By default also depends on `target` webpack config option:

- `svg-baker-runtime/browser-symbol` for 'web' target.
- `svg-baker-runtime/symbol` for other targets.

<a id="runtime-generator"></a>

### `runtimeGenerator`

Path to node.js script that generates client runtime.
Use this option if you need to produce your own runtime, e.g. React component configured with imported
symbol.

## License

See [LICENSE](LICENSE)

## Credits

Huge thanks for [all this people](https://github.com/JetBrains/svg-sprite-loader/graphs/contributors).
