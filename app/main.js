import css from './css/index.less'
import pic from './images/1.png'

const ele = `<div class="${css.ele}">css module</div>`

var img = new Image()
img.src = pic
var root = document.getElementById("root")
root.append(img)

document.write(ele)
