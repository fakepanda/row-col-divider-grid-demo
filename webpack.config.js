/*
 *./webpack.config.js
 */
const path = require('path');
const webpack = require('webpack');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
//   template: './src/index.html',
//   filename: 'index.html',
//   inject: 'body'
// });

module.exports = {
  entry: {
    bundle: './src/index.js'
  },
  output: {
    path: path.resolve('docs'),
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react']
        }
      },
      {
        test: /\.jsx$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react']
        }
      }
    ]
  },
  //plugins: [HtmlWebpackPluginConfig],
  devServer: {
    inline: true,
    port: 8008
  },
  devtool: 'cheap-source-map'
};
