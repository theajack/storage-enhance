const path = require('path');
const webpack = require('webpack');

module.exports = {
    watch: true,
    mode: 'production',
    entry: path.resolve('./', 'src/index.ts'),
    output: {
        path: path.resolve('./', 'public'),
        filename: 'node-dev.min.js',
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
        new webpack.DefinePlugin({
            // 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }),
    ]
};