/*
 * @Author: zihao.chen
 * @Description: 
 */
const { merge } = require('webpack-merge');
const webpackBase = require('./webpack.base')
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = merge(webpackBase,{
  mode: 'production',
  plugins: [
    new CleanWebpackPlugin({
      verbose: true,
    })
  ],
})