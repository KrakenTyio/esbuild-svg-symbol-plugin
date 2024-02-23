const { promises: fs } = require('fs');
const path = require('path');
const SVGCompiler = require('svg-baker');
const { convert } = require('url-slug');

const defaultConfig = require('./config').loader;

const Exceptions = require('./exceptions');

let svgCompiler = new SVGCompiler();

let cache = new Map();

function svgSymbolLoaderPlugin(config) {
    config = {
        ...defaultConfig,
        ...config,
    };

    return {
        name: 'svg-symbol-loader',
        setup(build) {
            let runtimeGenerator;
            try {
                runtimeGenerator = require(config.runtimeGenerator);
            } catch (e) {
                throw new Exceptions.InvalidRuntimeException(e.message);
            }

            build.onLoad({ filter: /\.svg$/ }, async (args) => {
                const { path: resourcePath } = args;

                if (!cache.has(resourcePath)) {
                    try {
                        const contents = await fs.readFile(resourcePath, 'utf-8');

                        if (!contents.includes('<svg')) {
                            throw new Exceptions.InvalidSvg(contents);
                        }

                        const id = convert(path.basename(args.path, '.svg'));

                        const symbol = await svgCompiler.addSymbol({
                            id,
                            content: contents,
                            path: resourcePath,
                        });

                        const runtime = runtimeGenerator({
                            symbol,
                            config,
                            path: resourcePath,
                        });

                        const value = { contents: runtime, loader: 'ts' };
                        cache.set(resourcePath, value);

                        return value;
                    } catch (error) {
                        throw new Error(`Error processing SVG: ${error.message}`);
                    }
                }

                return cache.get(resourcePath);
            });
        },
    };
}

module.exports = svgSymbolLoaderPlugin;
