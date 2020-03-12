# webpack.config
webpack基础配置配置

# 前言
在现有流行的脚手架搭建框架时，webpack等强大的工具往往都会被配置好以便快速开发。webpack的配置使用是前端一门必须掌握的技能，一个好的webpack配置不仅能加快开发速度，更能在打包生产后优化浏览器加载效率，因此本人也抽空重新学习了关于webpack基础配置，将此配置过程记录供之后参考。该配置为新手入门级别，更多更强大的配置请参考[webpack官方文档](https://webpack.js.org)

## 目录结构
- app - 需要打包的html、js、css、json等模板
- build - 打包存放文件夹
- public - 代理文件夹
- webpack.config.js - webpack配置文件

<summary>webpack.config配置</summary>

```javascript
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  //  source Map生成 使调试更加容易，建议只在开发测试环境使用
  devtool: "eval-source-map",
  //入口文件
  entry: {
    index: __dirname + "/app/main.js"
  },
  output: {
    path: __dirname + "/build", //打包后的文件存放的地方
    filename: "[name]bundle-[hash].js" //打包后输出文件的文件名
  },

  devServer: {
    contentBase: "./public", //本地服务器所加载的页面所在的目录
    historyApiFallback: true, //不跳转
    inline: true //实时刷新
  },
  module: {
    rules: [
      //复杂的配置可提出相关部分，生成.babelrc配置文件中，webpack会自动调用里面的配置项
      {
        test: /(\.jsx|\.js)$/, // 文件筛选正则
        use: {
          loader: "babel-loader" //loader库
        },
        exclude: /node_modules/ //不编译的目录
      },
      {
        // style-loader将所有的计算后的样式以<style>注入页面
        // css-loader能以import等方式加载.css文件  需要与上者配合
        test: /\.css$/,
        use: [
          // 多loader引用方式
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: "[path][name]__[local]--[hash:base64:5]"
              }
            }
          },
          //自动添加浏览器前缀
          {
            loader: "postcss-loader",
            options: {
              plugins: () => [
                require("autoprefixer")({
                  overrideBrowserslist: ["last 50 versions"]
                })
              ]
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: __dirname + "/app/index.tmpl.html" //new 一个这个插件的实例，并传入相关的参数
    })
  ],
  /**
   * chunks：表示从哪些chunks里面抽取代码，除了三个可选字符串值 initial、async、all 之外，还可以通过函数来过滤所需的 chunks；
   * minSize：表示抽取出来的文件在压缩前的最小大小，默认为 30000；
   * maxSize：表示抽取出来的文件在压缩前的最大大小，默认为 0，表示不限制最大大小；
   * minChunks：表示被引用次数，默认为1；上述配置commons中minChunks为2，表示将被多次引用的代码抽离成commons。
   */
  optimization: {
    splitChunks: {
      /**
        async 仅提取按需载入的module
        initial 仅提取同步载入的module
        all 按需、同步都有提取
      */
      chunks: "all",
      // 只有导入的模块 大于 该值 才会 做代码分割 （单位字节）
      minSize: 30000,
      // 提取出的新chunk在两次压缩之前要小于多少kb，默认为0，即不做限制
      maxSize: 0,
      // 被提取的chunk最少需要被多少chunks共同引入
      minChunks: 1,
      // 按需加载的代码块（vendor-chunk）并行请求的数量小于或等于5个
      maxAsyncRequests: 5,
      // 初始加载的代码块，并行请求的数量小于或者等于3个
      maxInitialRequests: 3,
      // 默认命名 连接符
      automaticNameDelimiter: "~",
      /**
          name 为true时，分割文件名为 [缓存组名][连接符][入口文件名].js
          name 为false时，分割文件名为 [模块id][连接符][入口文件名].js
          如果 缓存组存在 name 属性时 以缓存组的name属性为准
      */
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/, // 匹配node_modules目录下的文件
          priority: -10 // 优先级配置项
        },
        default: {
          // 表示这个库 至少被多少个chunks引入，
          minChunks: 2,
          priority: -20, // 优先级配置项
          // 如果这个模块已经 被分到 vendors组，这里无需在分割 直接引用 分割后的
          reuseExistingChunk: true
        }
      }
    }
  }
};

//注意package里面babel的版本号，版本号差异会造成冲突。 解决办法:可进行babel升降级，修改package的版本号，并删除node_modules重新下载
//新旧版本配置有差异，建议到官方去查询 https://webpack.js.org/

```

## Last
网上许多webpack的配置方案有时会因为版本差异而导致失败，因此一切以官方文档为准！！！
除了以上配置功能外，像typescript，less，pxtorem等等常用配置也不一一详写，后续本人也会在空余时间继续深入了解，继续更新
