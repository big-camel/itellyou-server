module.exports.ALLOW_ORIGIN = '*'
module.exports.ALLOW_METHOD = '*'
module.exports.ALLOW_CREDENTIALS = 'true'
module.exports.ALLOW_HEADERS = "*"
module.exports.HOST = "http://localhost:8088"
module.exports.PORT = "8010"
module.exports.FILTER = {
    urls:["http://localhost:8088/api/*"],
    exclude:({ url }) => {
        return url.indexOf('/user/me') > -1
    }
}