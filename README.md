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
  11、预取/预加载模块 prefetch/preload  
    动态导入操作符是作为函数使用的。它接受一个字符串参数，返回一个Promise。当模块加载好后，这个Promise被resolve。  
    在Webpack中使用动态导入，会新增一个chunk，我们视作异步chunk。  

    ```javascript
    let fileName = ''; 
    document.addEventListener("DOMContentLoaded", () => {
      const button = document.querySelector('#divideButton');
      fileName = 'divide';
      button.addEventListener('click', () => {
        import(`./utilities/${fileName}`)
          .then(divideModule => {
            console.log(divideModule.divide(6, 3)); // 2
          })
      });
    });
    ```
    以上代码在你的项目中被打包过后，你会发现Webpack在utilities文件夹下为每个模块单独创建了异步chunk。这是因为Webpack不能在编译时知道哪些模块需要被导入。  
    使用在Webpack中使用魔法注释来使用附加参数。  
    webpackExclude，它是一个正则表达式，用以匹配潜在的可被导入的文件。任何匹配到的文件都不会被打包进来。  
    webpackInclude,使用它时，只有匹配了正则表达式的模块会被打包。  

    webpackMode  
      lazy - 这是默认模式。它为每个动态导入的模块创建异步chunk。  
      lazy-once - 使用它，会为满足导入条件的所有模块创建单一的异步chunk。  
      eager - 此模式会阻止Webpack生成额外的chunk。所有导入的模块被包含在当前chunk，所以不需要再发额外的网络请求。它仍然返回一个Promise，但它被自动resolve。使用eager模式的动态导入与静态导入的区别在于，整个模块只有当**import()**掉用之后才执行。  
      weak - 彻底阻止额外的网络请求。只有当该模块已在其他地方被加载过了之后，Promise才被resolve，否则直接被reject。  

    webpackChunkName  
      它是新chunk的名字，可以和[index]、[request]变量一起使用。  
      [index]在当前动态导入声明中表示文件的索引。另一方面，[request]表示导入文件的动态部分。  
    ```javascript
      
      import(
        `./utilities/${fileName}`
        /* webpackChunkName: "utilities-[index]-[request]" */
      )
   
     ```

    -prefetch 在浏览器资源进程空闲时，进行加载(可避免某些空白交互)  
    import(/*webpackPrefetch:true*/'./click.js').then(()=>{}) 使用魔法注释声明  
    <link rel="prefetch" as="script" href="click.js">被添加至页面的头部。因此浏览器会在空闲时间预先拉取该文件。  

    -preload 预先加载,在资源上添加预先加载的注释，你指明该模块需要立即被使用。异步chunk会和父级chunk并行加载。如果父级chunk先下载好，页面就已可显示了，同时等待异步chunk的下载。这能大幅提升性能。  
    ```javascript
    import(
      `./utilities/divide`
      /* webpackPreload: true */
      /* webpackChunkName: "utilities" */
    )
    ```
    以上代码的效果是让<link rel="preload" as="script" href="utilities.js">起作用  
  
  12、Scope Hositing 作用域提升是指webpack通过es6语法的静态分析，分析出模块之间的依赖关系，尽可能的把模块放到同一个闭包函数中  
    optimization中concatenateModules:true  
    优化bundle文件体积  

  13、使用工具量化  
    speed-measure-webpack-plugin:可以测量各个插件和loader所花费时间  
    webpack-bundle-analyzer:分析webpack打包后的模块依赖关系,观察依赖体积等  

  14、DllPlugin插件打包第三方类库 预先编译  
    Dll动态链接库 其实就是做缓存，每次只打包开发业务代码,只会提升webpack打包速度，并不能减少最后生成代码的体积（提升开发体验）  

## ps
webpack的配置方法，具体以官方为主，某些插件及loader可到github上搜寻相关配置参数  
配置babel时要注意，babel的每个包大版本必须保持一致，其中某个包跨版本可能会导致打包失败
