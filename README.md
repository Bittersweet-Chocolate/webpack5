## 1. path 的区别和联系?

- publicPath 可 以看作是 devServer 对生成目录`dist`设置的虚拟目录，devServer 首先从 devServer.devMiddleware.publicPath 中取值，如果它没有设置，就取`output.publicPath`的值作为虚拟目录，如果它也没有设置，就取默认值`/`
- `output.publicPath`不仅可以影响虚拟目录的取值，也影响利用 html-webpack-plugin 插件生成的 index.htm1 中引用的 js、css、img 等资源的引用路径。会自动在资源路径前面追加设置的 output.publicPath
- 一般情况下都要保证`devServer`中的`devMiddleware.publicPath`和`output.publicPath`一致

|类别|配置名称|描述|
|output|path|指定输出到硬盘上的目录|
|output|publicPath|表示的是打包生成的 index .html 文件里面引用资源的前缀|
|devServer|devMiddleware.publicPath|表示的是打包生成的静态文件所在的位置(若是 devServer 里面的 publicPath 没有设置，则会认为是 output 里面设置的 publicPath 的值)|
|devServer|static.publicPath|用于配置提供额外静态文件内容的目录|

## babel-env 参数

- https://babeljs.io/docs/en/babel-preset-env#targets

## source-map

用于映射编译后的的文件信息

- source-map 支持到行和列以及 loader
- cheap-source-map 支持到行，没有 loader
- cheap-module-source-map 包含 loader 的 source-map

## 打包第三方库

### 本地引入

缺点：打包过大

- 直接`import`引入
- 插件引入`webpack.ProvidePlugin` 方便点不需要每次手动引入，直接能使用，缺点无法全局使用。例如：index.html
- expose-loader 引入

### cdn 引入

- 通过 cdn 外部引入，使用`externals`，就可以不打包。 缺点：需要我们手工或者插入 cdn 脚本，不管有没有用到都会引入。
- 同 cdn 配置过程不同，`html-webpack-externals-plugin` 按需引入

## babel 相关

- `babel`转译

  - 在`babel-loader`中通过`babel/core`讲代码转换成`ast`语法树，再由`babel/preset-env`将语法树转为`es5`
  - 最后`babel/core`将`es5`语法树重新转为代码

例如：`Array.from`

- `polyfill` 原生的 Array.prototype 加个属性。已经没没有在更新了，现在使用`core.js`。在 webpack5 中，使用`useBuiltIns: 'entry'`，然后在入口处引入
  - `import "core-js/stable"`
  - `import -"regenerator-runtime/runtime"`
- `babel-runtime` 类似闭包的方式，解决全局污染问题，`polyfill`这种加载方式会污染全局变量。
- `babel-plugin-transfrom-runtime`，避免自己每次去垫片，自动`import`方法

### 用处

- `babel-runtime`适合在组件和类库项目使用，而`babel-polyfill`适合在业务项目中使用

## 环境配置相关

```diff
 "scripts": {
    "dev": "webpack-dev-serve --open"
  }
```

- 通过`--mode=development`来改变默认值，要高于 webpack 中配置的`mode`属性值
- 通过`--env=development`传参，传给`webpack`配置文件导出的函数值
- `cross-env NODE_ENV=development`设置变量在`process.env`

### 设置全局变量

- `webpack.DefinePlugin`，参数都是字符串类型，并非挂载在 window 下，打包的时候就已经被赋值了

## watch、copy、clean

- `watch`监听打包状态
- `copy`复制文件插件
- `clean`清空打包目录 dist 插件

## css 插件

## bundle、chunk、hash

webpack 中没有 bundle 概念，成为 asset

- 每一个入口一般来说会生成一个 chunk，一个代码会生成一个 bundle 打包的资源文件

## hash、

## 热更新配置问题

### js 热更新

### css 热更新

### html 热更新
