const PACKAGE_NAME = require('../package.json').name;

module.exports = {
    PACKAGE_NAME,

    /**
     * Overridable loader options
     */
    loader: {
        /**
         * Path to Node.js module which generates client runtime.
         * @type {string}
         */
        runtimeGenerator: require.resolve('./runtime-generator'),

        /**
         * Path to sprite module which will be compiled and executed at runtime.
         * By default depends on 'target' webpack config option:
         * - `svg-sprite-loader/runtime/browser-sprite.build` for 'web' target.
         * - `svg-sprite-loader/runtime/sprite.build` for all other targets.
         * @type {string}
         */
        spriteModule: require.resolve('./runtime/browser-sprite'),

        /**
         * Path to symbol module.
         * By default depends on 'target' webpack config option:
         * - `svg-baker-runtime/browser-symbol` for 'web' target.
         * - `svg-baker-runtime/symbol` for all other targets.
         * @type {string}
         */
        symbolModule: require.resolve('svg-baker-runtime/browser-symbol'),

        /**
         * Generated export format:
         * - when `true` loader will produce `export default ...`.
         * - when `false` the result is `module.exports = ...`.
         * By default depends on used webpack version. `true` for Webpack >= 2, `false` otherwise.
         * @type {boolean}
         */
        esModule: true,
    },
};
