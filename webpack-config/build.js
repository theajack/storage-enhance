const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const RunNodeWebpackPlugin = require('run-node-webpack-plugin');

const fs = require('fs');
const version = require('../package.json').version;

fs.writeFileSync(path.resolve('./', 'src/version.ts'), `export default '${version}';`, 'utf8');

module.exports = () => {
    return {
        mode: 'production',
        entry: path.resolve('./', 'src/index.ts'),
        output: {
            path: path.resolve('./', 'npm'),
            filename: 'storage-enhance.min.js',
            library: 'StorageEnhance',
            libraryTarget: 'umd',
            libraryExport: 'default',
            globalObject: 'this',
        },
        resolve: {
            extensions: [ '.tsx', '.ts', '.js' ]
        },
        externals: {
            'fs': 'commonjs fs',
            'path': 'commonjs path'
        },
        module: {
            rules: [{
                test: /(.ts)$/,
                use: {
                    loader: 'ts-loader'
                }
            }, {
                test: /(.js)$/,
                use: [{
                    loader: 'babel-loader',
                }]
            }, {
                test: /(.js)$/,
                loader: 'eslint-loader',
                enforce: 'pre',
                exclude: /node_modules/,
                options: {
                    configFile: './.eslintrc.js'
                }
            }]
        },
        plugins: [
            new CopyWebpackPlugin({
                patterns: [
                    {from: 'src/type', to: 'type'},
                    {from: 'README.cn.md'},
                    {from: 'README.md'},
                    {from: 'LICENSE'}
                ]
            }),
            new RunNodeWebpackPlugin({scriptToRun: './helper/sync-npm-version.js'})
        ]
    };
};