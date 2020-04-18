# 使用 Electron 离屏渲染 React/Vue 等SPA单页或异步数据请求，以满足 SEO 需求

## 配置 config.js
```
// 需要渲染的本地站点
module.exports.HOST = "http://localhost:8011"
// 拦截数据请求 ，在数据请求执行完毕返回html代码，没有数据请求的情况下默认为600ms返回，
module.exports.FILTER = {
    urls:["http://localhost:8011/api/*"],// 在拦截后，全部数据请求返回后等待10ms读取渲染后的html
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
## 配置 nginx，搜索引擎反向代理
```
location / {
    if ($http_user_agent ~* "BaiduSpider|360Spider|Sogou web spider|Bingbot|Sosospider|YisouSpider"){
        proxy_pass   http://localhost:8010;
    }
    root web_root;
    index index.html;
    try_files $uri $uri/ /index.html =404;
}
```