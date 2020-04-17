module.exports.ALLOW_ORIGIN = '*'
module.exports.ALLOW_METHOD = '*'
module.exports.ALLOW_CREDENTIALS = 'true'
module.exports.ALLOW_HEADERS = "*"
module.exports.HOST = "https://www.itellyou.com"
module.exports.PORT = "8010"
module.exports.FILTER = {
    urls:["https://www.itellyou.com/api/*"],
    exclude:({ url }) => {
        return url.indexOf('/user/me') > -1
    }
}