# webpack.config
webpack基础配置配置

# 前言
在现有流行的脚手架搭建框架时，webpack等强大的工具往往都会被配置好以便快速开发。webpack的配置使用是前端一门必须掌握的技能，一个好的webpack配置不仅能加快开发速度，更能在打包生产后优化浏览器加载效率，因此本人也抽空重新学习了关于webpack基础配置，将此配置过程记录供之后参考。该配置为新手入门级别，更多更强大的配置请参考[webpack官方文档](https://webpack.js.org)

## 目录结构
- app - 需要打包的html、js、css、json等模板
- build - 打包存放文件夹
- public - 代理文件夹
- webpack.config.js - webpack配置文件
- reactapp 打包react测试目录

## 优化方案及注意事项
1、缩小loader查找范围(include,exclude)
2、优化resolve.modules配置
  用于配置webpack去拿些目录下寻找第三方模块，默认node_modules中查找
  默认查询机制当前根目录下node_modules去寻找，若找不到会去上一级寻找(../node_modules),因此可以设定只在当前目录寻找，取消向上寻找机制
3、优化resolve.alias配置
  resolve.alias配置通过别名来将原导入路径映射成一个新的导入路径
  eg：react:./node_modules/react/umd/react.production.min.js 减少从模块包index入口查找过程
4、优化resolve.extensions配置
  resolve.extensions在导入语句没带文件后缀时，webpack会自动带上后缀后，去尝试查找文件是否存在
  在导入时尽量带后缀
5、使用externals优化cdn静态资源
  将一些js文件存储到cdn上（减少webpack打包体积），在index上通过标签引入
6、development/production模式区分打包:webpack可以共用配置、development、production配置可以分开多个文件编写，最后在开发和生产配置上通过webpack-merge合并，结合packjson命令行分别执行
7、采用css预处理器、借助MiniCssExtractPlugin、optimize-css-assets-webpack-plugin等工具包 抽离 压缩css等
8、tree Shaking(摇树)：清除无用的css、js
    -js 摇树支持是es module引入，不支持commonJs
    css摇树相关插件：glob-all（用于匹配路径规则下的所有文件） purify-css prifycss-webpack等
    js配置：optimizaion;{ usedExports:true }  // 内置模块不依赖第三方，哪些导出模块被使用了，再做打包
9.sideEffects处理副作用
    packjson内的字段，值：string[]，数组内文件路径不进行摇树，例如b@abel/profill
10、代码分割 code Splitting（详情字段可看webpack.config.js）

    ```javascript
      
      optimization:{
        spllitChunks:{
          chunks: "all" // 所有的chunks代码公共部分分离出来成为一个单独的js文件
        }
      }

    ```
## ps
webpack的配置方法，具体以官方为主，某些插件及loader可到github上搜寻相关配置参数
配置babel时要注意，babel的每个包大版本必须保持一致，其中某个包跨版本可能会导致打包失败
