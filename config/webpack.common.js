const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const { ENV, IS_PRODUCTION, APP_VERSION, IS_DEV, dir } = require('./helpers');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = function (options = {}) {
  return {
    context: dir(),
    resolve: {
      extensions: ['.ts', '.js', '.json', '.css', '.scss', '.html'],
      modules: [
        'node_modules',
        dir('src'),
        dir('demo')
      ]
    },
    performance: {
      hints: false
    },
    output: {
      path: dir('dist'),
      filename: '[name].js',
      sourceMapFilename: '[name].map',
      chunkFilename: '[id].chunk.js'
    },
    module: {
      exprContextCritical: false,
      rules: [
        {
            test: /\.html$/,
            loader: 'html-loader'
        },
    {
            test: /\.(scss)$/,
            use: [
               'to-string-loader',
                { loader: 'style-loader', options: { sourceMap: IS_DEV } },
                { loader: 'css-loader', options: { sourceMap: IS_DEV } },
                { loader: 'sass-loader', options: { sourceMap: IS_DEV } }
            ],
        }
      
    ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // all options are optional
        filename: '[name].css'
      }),
      new webpack.NamedModulesPlugin(),
      new webpack.DefinePlugin({
        ENV,
        IS_PRODUCTION,
        APP_VERSION,
        IS_DEV,
        HMR: options.HMR
      }),
      new webpack.LoaderOptionsPlugin({
        options: {
          context: dir(),
          tslint: {
            emitErrors: false,
            failOnHint: false,
            resourcePath: 'src'
          },
          postcss: function () {
            return [autoprefixer];
          }
        }
      })
    ]
  };

};