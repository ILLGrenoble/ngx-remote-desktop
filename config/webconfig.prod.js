const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const commonConfig = require('./webpack.common');
const { ENV, dir } = require('./helpers');
const { CheckerPlugin } = require('awesome-typescript-loader');

module.exports = function(env) {
  return webpackMerge(commonConfig({ env: ENV }), {
    devtool: 'source-map',
    entry: {
      'app': './demo/bootstrap.ts'
    },
    module: {
      exprContextCritical: false,
      rules: [
        {
          enforce: 'pre',
          test: /\.js$/,
          loader: 'source-map-loader',
          exclude: /(node_modules)/
        },
        {
          test: /\.ts$/,
          loaders: [
            'awesome-typescript-loader',
            'angular2-template-loader'
         ],
          exclude: [/\.(spec|e2e|d)\.ts$/]
        }
      ]
    },
    plugins: [
      new webpack.optimize.ModuleConcatenationPlugin(),
      new CheckerPlugin(),
      new HtmlWebpackPlugin({
        template: 'demo/index.html',
        chunksSortMode: 'dependency',
        title: 'ngx-remote-desktop'
      }),
      new CleanWebpackPlugin(['dist'], {
        root: dir(),
        verbose: false,
        dry: false
      }),
      new webpack.optimize.UglifyJsPlugin()
    ],
  }
  });

};
