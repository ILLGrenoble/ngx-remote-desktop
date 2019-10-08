const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {
    CheckerPlugin
} = require('awesome-typescript-loader');


const commonConfig = require('./webpack.common');
const {
    ENV,
    dir
} = require('./helpers');

module.exports = function (options) {
    return webpackMerge(commonConfig({
        env: ENV
    }), {
        devtool: 'cheap-module-eval-source-map',
        devServer: {
            port: 9999,
            hot: options.HMR,
            stats: {
                colors: true,
                hash: true,
                timings: true,
                chunks: true,
                chunkModules: false,
                children: false,
                modules: false,
                reasons: false,
                warnings: true,
                assets: false,
                version: false,
                stats: {
                    warningsFilter: /System.import/ // https://github.com/angular/angular/issues/21560
                }
            }
        },
        entry: {
            'main': './demo/main.ts'
        },
        entry: {
            polyfills: './demo/polyfills.ts',
            main: './demo/main.ts'
        },
        optimization: {
            noEmitOnErrors: true
        },
        target: "web",
        module: {
            rules: [
                {
                    // Mark files inside `@angular/core` as using SystemJS style dynamic imports.
                    // Removing this will cause deprecation warnings to appear.
                    test: /[\/\\]@angular[\/\\]core[\/\\].+\.js$/,
                    parser: { system: true },  // enable SystemJS
                },
                {
                    test: /\.ts$/,
                    loaders: [
                        {
                            loader: 'awesome-typescript-loader',
                            options: {
                                configFileName: dir('tsconfig.json')
                            }
                        },
                        'angular2-template-loader'
                    ],
                    exclude: [/node_modules/]
                }
            ]
        },
        plugins: [
            new CheckerPlugin(),
            new HtmlWebpackPlugin({
                template: 'demo/index.html',
                chunksSortMode: 'dependency',
            }),
            new webpack.HotModuleReplacementPlugin()
        ]
    });

};