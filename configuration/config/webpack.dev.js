/*
 * @Author: zihao.chen
 * @Description: 
 */
const { resolve } = require('path')
const { merge } = require('webpack-merge')
const webpackBase = require('./webpack.base')

module.exports = merge(webpackBase,{
  mode: 'development',
  devServer: {
    // 给静态资源文件一个路径，localhost:8080/index.txt
    static: [{
      directory: resolve(__dirname, '../static'),
      // 给资源文件加一个路径前缀  /static/index.txt
      publicPath: '/static',
    }],
    // 为 webpack-dev-middleware 提供处理 webpack 资源的配置项。
    // webpack-dev-middleware 是一个容器(wrapper), 它可以把 webpack 处理后的文件传递给一个服务器(server). 
    // 同时, 它也可以作为一个单独的包来使用, 以便进行更多自定义设置来实现更多的需求.
    devMiddleware: {
      // 启动之后的服务路径
      // publicPath: '/publicPathForDevServe',
      // writeToDisk: true,
    },
    compress: true,
    hot: true,
    port: 8080,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
      },
    },
    // 自己设定请求地址 Middlewares
    setupMiddlewares(middlewares, devServer) {
      // webpack-dev-server 其实就是一个express服务器
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }

      devServer.app.get('/some/path', (req, res) => {
        res.json({ custom: 'response' });
      });
      return middlewares;
    }
  }
})