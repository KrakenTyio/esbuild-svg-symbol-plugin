const { isAbsolute, join } = require('path');
const { stringifySymbol, generateImport, generateExport } = require('./utils');

function runtimeGenerator(params) {
    const { symbol, path, config } = params;

    const { esModule, spriteModule, symbolModule } = config;

    const spriteModuleAbsPath = isAbsolute(spriteModule)
        ? spriteModule
        : join(process.cwd(), spriteModule);
    const symbolModuleAbsPath = isAbsolute(symbolModule)
        ? symbolModule
        : join(process.cwd(), symbolModule);

    const pregenerate = [
        generateImport('SpriteSymbol', symbolModuleAbsPath, esModule),
        generateImport('sprite', spriteModuleAbsPath, esModule),
    ];

    const runtime = [
        ...pregenerate,
        `const symbol = new SpriteSymbol(${stringifySymbol(symbol, esModule)})`,
        'const result = sprite.add(symbol)',

        generateExport('symbol', esModule),
    ].join(';\n');

    return runtime;
}

module.exports = runtimeGenerator;
