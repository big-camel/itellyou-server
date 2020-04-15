# 使用 Electron 离屏渲染 React/Vue 等SPA单页或异步数据请求，以满足 SEO 需求

## 配置 config.js
```
// 需要渲染的已上线站点
module.exports.HOST = "http://localhost:8088"
// 拦截数据请求
module.exports.FILTER = {
    urls:["http://localhost:8088/api/*"],// 在拦截后，全部数据请求返回后等待10ms读取渲染后的html
    // 在拦截数据url的基础上，可以排除一些同步数据请求
    exclude:({ url }) => {
        return url.indexOf('/user/me') > -1
    }
}
```
## 使用
```
node src/index.js
```
elector 经常安装失败，建议设置
```
npm config set electron_mirror https://npm.taobao.org/mirrors/electron/
```