import css from './css/index.less'
import pic from './images/1.png'
// js HMR
import counter from './counter'
import number from './number'
// 模拟解决跨域
// import axios from 'axios'

counter()
number()

// JS HMR
// 原生HRM实现，检测模块改变时，手动移除
if (module.hot) {
    module.hot.accept('./number.js', function () {
        document.body.removeChild(document.getElementById("number"));
        number();
    })
}

// css HMR
// var btn = document.createElement("botton");
// btn.innerHTML = "新增";
// document.body.appendChild(btn);

// btn.onclick = function () { 
//     var div = document.createElement("div");
//     div.innerHTML = "item";
//     document.body.appendChild(div);
// }



// 模拟css模块化以及lessloader、cssloader配置
// const ele = `<div class="${css.ele}">css module</div>`

// 模拟图片打包
// var img = new Image()
// img.src = pic
// var root = document.getElementById("root")
// root.append(img)

// document.write(ele)

// 模拟跨域
// http://localhost:9092/api/info
// 本地起了一个服务，发出的请求都会请求到本地，然后转发到你请求的地址
// axios.get("/api/info").then(res => { 
//     console.log(res)
// })
