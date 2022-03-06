/*
 * @Author: czh
 * @Date: 2022-02-20 17:51:58
 * @Description: 
 */
const { resolve } = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin')
const copyWebpackPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = {
  mode: 'development',
  entry: {
    main: './src/index.js'
  },
  devtool: 'source-map',
  output: {
    // name 既入口的名称
    filename: '[name].[hash:5].js',
    path: resolve(__dirname, 'dist'),
    // assetModuleFilename: 'images/[hash][ext][query]'
    // 打包后的 引入文件前缀加上一下路径
    // 访问路径加文件名 publicPathForDevServe/js/main.js
    publicPath: '/'
  },
  module: {
    rules: [{
        test: /\.txt$/,
        type: 'asset/source'
      },
      {
        test: /\.html$/,
        use: ['html-loader']
      },
      {
        test: /\.css$/,
        use: [{
          loader: MiniCssExtractPlugin.loader,
        }, 'css-loader']
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'
        ]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024 // 4kb
          }
        },
        generator: {
          outputPath: 'images/',
          publicPath: 'images/'
        },
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: [
              // 转换js语法
              ['@babel/preset-env',
                {
                  // usage：按需加载 entry：适配方法全部引入，需要在入口文件import两个文件
                  useBuiltIns: 'usage',
                  corejs: { version: "3.21", proposals: true },
                  targets: "> 0.25%, not dead"
                }
              ]
            ],
            plugins: [
              // ['@babel/plugin-transform-runtime', {
              //   corejs: 3, //@babel/runtime-corejs3   
              //   helpers: true,
              //   regenrator: true
              // }],
              ["@babel/plugin-proposal-decorators", { legacy: true }],
              // @babel/preset-env内置存在
              // ["@babel/plugin-proposal-class-properties", { loose: true }]
            ]
          },
        }]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: '1.html',
      // 根据入口设定的模块来
      chunks: ['main']
    }),
    new HtmlWebpackExternalsPlugin({
      externals: [{
        module: 'lodash',
        entry: 'https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js',
        global: '_'
      }]
    }),
    // 自定义全局变量插件
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(true),
      VERSION: JSON.stringify('5fa3b9')
    }),
    new copyWebpackPlugin({
      patterns: [{
        from: resolve(__dirname, 'src/doc'),
        to: resolve(__dirname, 'dist/doc')
      }]
    }),
    new CleanWebpackPlugin({
      verbose: true,
    }),
    new MiniCssExtractPlugin()
  ],
  devServer: {
    // 给静态资源文件一个路径，localhost:8080/index.txt
    static: [{
      directory: resolve(__dirname, 'static'),
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
}