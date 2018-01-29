const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const commonConfig = require('./webpack.common');
const {
  ENV,
  dir,
  APP_VERSION
} = require('./helpers');
const {
  CheckerPlugin
} = require('awesome-typescript-loader');

const banner =
  `/**
 * ngx-remote-desktop v${APP_VERSION} (https://github.com/ILLGrenoble/ngx-remote-desktop)
 * Copyright 2018
 * Licensed under MIT
 */`;

module.exports = function (env) {
  return webpackMerge(commonConfig({
    env: ENV
  }), {
    devtool: 'source-map',
    module: {
      exprContextCritical: false,
      rules: [{
        test: /\.ts$/,
        loaders: [
          'awesome-typescript-loader',
          'angular2-template-loader'
        ],
        exclude: [/\.(spec|e2e|d)\.ts$/]
      }]
    },
    entry: {
      'index': './src/index.ts'
    },
    output: {
      path: dir('release'),
      libraryTarget: 'umd',
      library: 'ngxDatatable',
      umdNamedDefine: true
    },
    externals: {
      '@angular/platform-browser-dynamic': '@angular/platform-browser-dynamic',
      '@angular/platform-browser': '@angular/platform-browser',
      '@angular/core': '@angular/core',
      '@angular/common': '@angular/common',
      '@angular/animations': '@angular/animations',
      'core-js': 'core-js',
      'core-js/es6': 'core-js/es6',
      'core-js/es7/reflect': 'core-js/es7/reflect',
      'rxjs': 'rxjs',
      'rxjs/Rx': 'rxjs/Rx',
      'rxjs/Observable': 'rxjs/Observable',
      'rxjs/BehaviorSubject': 'rxjs/BehaviorSubject',
      'rxjs/ReplaySubject': 'rxjs/ReplaySubject',
      'rxjs/Subscription': 'rxjs/Subscription',
      'rxjs/operators': 'rxjs/operators',
      'zone.js/dist/zone': 'zone.js/dist/zone',
      'screenfull': 'screenfull',
      '@illgrenoble/guacamole-common-js': '@illgrenoble/guacamole-common-js'

    },
    plugins: [
      new webpack.optimize.ModuleConcatenationPlugin(),
      new CheckerPlugin(),
      new webpack.BannerPlugin({
        banner: banner,
        raw: true,
        entryOnly: true
      })
    ]
  });

};