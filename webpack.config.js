const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
module.exports = {
  // 打包模式 none --不加任何优化 production --启用多个优化插件，混淆压缩等 --development测试环境 打包不会混淆压缩
  mode: 'development',

  // 上下文 项目打包的相对路径 必须是绝对路径
  // context:process.cwd(),

  //  source Map生成 使调试更加容易，建议只在开发测试环境使用  开发环境默认开启
  devtool: "eval-source-map",
  //入口文件
  // 单入口文件
  // entry: __dirname + "/app/main.js",
  // entry:[__dirname + "/app/main.js"],
  // 多入口文件 --对应多输出文件
  entry: {
    index: __dirname + "/app/main.js"
  },
  output: {
    // 资源文件发包位置 必须是绝对路径 
    path: __dirname + "/build", //打包后的文件存放的地方
    // filename: "[name]bundle-[hash:6].js" //打包后输出文件的文件名
    filename: "main.js" //打包后输出文件的文件名

    /**
     * 占位符
     * hash 整个项目的hash指，每构建一次就会有一个新的hash产生 打包日志会输出  ：number取hash后number为数字
     * chunkhash 根据不同入口entry进行依赖解析，构建对应chunkhash，只要组成entry的模块内容没有改动，则对应hash不变
     */
  },

  devServer: {
    contentBase: "./build", //本地服务器所加载的页面所在的目录,目录下为空，页面都放到内存中
    historyApiFallback: true, //不跳转
    inline: true, //实时刷新，
    open: true //服务器启动后是否某人打开浏览器
  },
  // loader 执行顺需是从后往前的
  // 处理webpack不支持模块，webpack默认只支持js及json，遇到css less ts等需要对应loader进行解析
  // 一个loader只处理一件事情 loader有执行顺序
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
        test: /\.less$/, // 文件筛选正则
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              // css模块化启用
              modules: true
            }
          },
          {
            // 本地新建postcss.config.js会读取内部配置
            // 在css-loader之前
            loader: 'postcss-loader'
          },
          "less-loader"
        ],
        exclude: /node_modules/ //不编译的目录
      },
      {
        // style-loader将样式以<style>注入页面
        // css-loader能在js文件中以import等方式加载.css文件  需要与上者配合
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
      },
      // 文件处理
      {
        //  ? e可有可无 jpg jpeg兼容
        test: /\.(png|jpe?g|gif)$/,
        use: {
          loader: "url-loader",
          // loader: "file-loader", 
          // url-loader包含file-loader 推荐使用url-loader 因为url-loader支持limit：单位字节 当图片小于limit字节时，图片转换base64 打包到bundle内部
          // 小体积图片资源转成base64
          options: {
            // ext 后缀名
            name: "[name]_[hash:6].[ext]",
            outputPath: 'images/'
          }
        },
      },
    ]
  },
  // 插件 插件执行与打包声明周期挂钩
  plugins: [
    // 打包前动态清空打包文件夹文件
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      // HtmlWebpackPlugin默认支持ejs语法 可替换html文件内容
      // <title><%= htmlWebpackPlugin.options.title %></title>
      title: "首页",
      template: __dirname + "/app/index.html" //new 一个这个插件的实例，并传入相关的参数
    })
  ],
  /**
   * chunks：表示从哪些chunks里面抽取代码，除了三个可选字符串值 initial、async、all 之外，还可以通过函数来过滤所需的 chunks；
   * minSize：表示抽取出来的文件在压缩前的最小大小，默认为 30000；
   * maxSize：表示抽取出来的文件在压缩前的最大大小，默认为 0，表示不限制最大大小；
   * minChunks：表示被引用次数，默认为1；上述配置commons中minChunks为2，表示将被多次引用的代码抽离成commons。
   */
  // optimization: {
  //   splitChunks: {
  //     /**
  //       async 仅提取按需载入的module
  //       initial 仅提取同步载入的module
  //       all 按需、同步都有提取
  //     */
  //     chunks: "all",
  //     // 只有导入的模块 大于 该值 才会 做代码分割 （单位字节）
  //     minSize: 30000,
  //     // 提取出的新chunk在两次压缩之前要小于多少kb，默认为0，即不做限制
  //     maxSize: 0,
  //     // 被提取的chunk最少需要被多少chunks共同引入
  //     minChunks: 1,
  //     // 按需加载的代码块（vendor-chunk）并行请求的数量小于或等于5个
  //     maxAsyncRequests: 5,
  //     // 初始加载的代码块，并行请求的数量小于或者等于3个
  //     maxInitialRequests: 3,
  //     // 默认命名 连接符
  //     automaticNameDelimiter: "~",
  //     /**
  //         name 为true时，分割文件名为 [缓存组名][连接符][入口文件名].js
  //         name 为false时，分割文件名为 [模块id][连接符][入口文件名].js
  //         如果 缓存组存在 name 属性时 以缓存组的name属性为准
  //     */
  //     name: true,
  //     cacheGroups: {
  //       vendors: {
  //         test: /[\\/]node_modules[\\/]/, // 匹配node_modules目录下的文件
  //         priority: -10 // 优先级配置项
  //       },
  //       default: {
  //         // 表示这个库 至少被多少个chunks引入，
  //         minChunks: 2,
  //         priority: -20, // 优先级配置项
  //         // 如果这个模块已经 被分到 vendors组，这里无需在分割 直接引用 分割后的
  //         reuseExistingChunk: true
  //       }
  //     }
  //   }
  // }
};

//注意package里面babel的版本号，版本号差异会造成冲突。 解决办法:可进行babel升降级，修改package的版本号，并删除node_modules重新下载
//新旧版本配置有差异，建议到官方去查询 https://webpack.js.org/
