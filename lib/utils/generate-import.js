const stringify = require('./stringify');

/**
 * @param {string} symbol - Symbol name
 * @param {string} module - Module name
 * @param {boolean} esModule
 * @return {string}
 */
function generateImport(symbol, module, esModule = true) {
    return esModule
        ? `import ${symbol} from ${stringify(module)}`
        : `var ${symbol} = require(${stringify(module)})`;
}

module.exports = generateImport;
