const { createProxyMiddleware } = require('http-proxy-middleware')
const express = require('express')
const { createView } = require('./electron')
const app = express()
const bodyParser = require('body-parser')
const { ALLOW_ORIGIN , ALLOW_METHOD , ALLOW_HEADERS , ALLOW_CREDENTIALS , HOST , PORT , FILTER } = require('./config')

app.use(bodyParser.json({limit: '10mb'}))
app.use(bodyParser.urlencoded({            
    extended: false
}))
//设置 api 转发
app.use(createProxyMiddleware('/api',{target:HOST}))
//设置资源文件(js,css,png)等转发
app.use(createProxyMiddleware('**/*.*',{target:HOST}))
app.disable('x-powered-by')

app.all('*',async (req,res,next) => {
    res.setHeader("Access-Control-Allow-Origin",ALLOW_ORIGIN)
    res.setHeader("Access-Control-Allow-Method",ALLOW_METHOD)
    res.setHeader("Access-Control-Allow-Credentials",ALLOW_CREDENTIALS)
    res.setHeader("Access-Control-Allow-Headers",ALLOW_HEADERS)
    next()
})

app.all('/*',async (req,res) => {
    const url = `${HOST}${req.originalUrl}`
    createView(url,FILTER,html => {
        res.setHeader('Content-Type','text/html;charset=utf-8')
        res.send('<!DOCTYPE html>' + html)
        res.end()
    })
})
const appPORT = process.env.PORT || PORT
app.listen(appPORT, () => console.log(`ITELLYOU SERVER listening on port ${appPORT}!`))
