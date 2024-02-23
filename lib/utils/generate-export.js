/**
 * @param {string} content
 * @param {boolean} [esModule=false]
 * @return {string}
 */
function generateExport(content, esModule = true) {
    return esModule ? `export default ${content}` : `module.exports = ${content}`;
}

module.exports = generateExport;
