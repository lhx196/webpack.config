const autoprefixer = require("autoprefixer")
module.exports = {
    plugins: [
        // postcss 使用autoprefixer 添加CSS3浏览器前缀
        autoprefixer({
            // [0] 兼容最新的2个版本  [1] 全球浏览器的市场份额>1%
            overrideBrowserslist: ["last 2 versions", ">1%"]
        })
    ]
}