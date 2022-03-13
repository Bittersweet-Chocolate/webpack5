/*
 * @Author: czh
 * @Date: 2022-02-20 17:51:58
 * @Description:
 */
const { resolve } = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackExternalsPlugin = require("html-webpack-externals-plugin");
const copyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  context: resolve(__dirname, "../"),
  entry: {
    main: "./src/index.js",
  },
  devtool: "source-map",
  output: {
    // name 既入口的名称
    filename: "[name].[hash:5].js",
    path: resolve(__dirname, "../dist"),
    // assetModuleFilename: 'images/[hash][ext][query]'
    // 打包后的 引入文件前缀加上一下路径
    // 访问路径加文件名 publicPathForDevServe/js/main.js
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.txt$/,
        type: "asset/source",
      },
      {
        test: /\.html$/,
        use: ["html-loader"],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "images/",
            },
          },
          "css-loader",
        ],
      },
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"],
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 4kb
          },
        },
        generator: {
          outputPath: "images/",
          // publicPath: "images/",
        },
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                // 转换js语法
                [
                  "@babel/preset-env",
                  {
                    // usage：按需加载 entry：适配方法全部引入，需要在入口文件import两个文件
                    useBuiltIns: "usage",
                    corejs: { version: "3.21", proposals: true },
                    targets: "> 0.25%, not dead",
                  },
                ],
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
              ],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      // 默认index.html
      filename: "index.html",
      // 根据入口设定的模块来
      chunks: ["main"],
    }),
    new HtmlWebpackExternalsPlugin({
      externals: [
        {
          module: "lodash",
          entry: "https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js",
          global: "_",
        },
      ],
    }),
    // 自定义全局变量插件
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(true),
      VERSION: JSON.stringify("5fa3b9"),
    }),
    // 最新版的需要上node 16
    new copyWebpackPlugin({
      patterns: [
        {
          from: resolve(__dirname, "../src/doc"),
          to: resolve(__dirname, "../dist/doc"),
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: "css/[name].[hash:5].css",
    }),
  ],
};
