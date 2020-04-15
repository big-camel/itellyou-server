const UUID = require('uuid');
const { app , BrowserView , BrowserWindow } = require('electron')

app.disableHardwareAcceleration()
app.on('window-all-closed', () => {
    if (process.platform != 'darwin') {
        app.quit()
    }
})

let browserWindow

let views = {}

const createWindow = options => {
    browserWindow = new BrowserWindow({
        width: 1000,
        height: 1000,
        show:false,
        paintWhenInitiallyHidden:false,
        webPreferences:{
            devTools:false
        },
        ...options
    })
    browserWindow.on('closed',() => {
        views = {}
    })
}

const readHtml = async id => {
    if(views[id]){
        return await views[id].view.webContents.executeJavaScript("var html = document.getElementsByTagName('html')[0].outerHTML;html",true)
    }
}
module.exports.createWindow = createWindow
const createView = (url , filter , onReady) => {
    const view = new BrowserView()
    browserWindow.addBrowserView(view)
    view.webContents.loadURL(url)
    view.webContents.setFrameRate(1)
    const id = UUID.v4() + "-" + (new Date().getTime())
    views[id] = {
        id,
        url,
        view,
        requests:[],
        completeds:[]
    }
    const { urls , exclude } = filter

    const reader = time => {
        return setTimeout(async () => {
            const html = await readHtml(id)
            views[id].view.destroy()
            delete views[id]
            if(onReady) onReady(html)
        },time)
    }
    let timeoutRead
    view.webContents.on("dom-ready",event => {
        //获取不到数据就直接取html
        timeoutRead = setTimeout(() => {
            if(views[id].requests.length === 0){
                reader(1)
            }
        },500)
    })
    view.webContents.session.webRequest.onBeforeRequest({urls}, (details, callback) => {
        if(!exclude || !exclude(details)) {
            views[id].requests.push(details.url)
        }
        callback(details)
    })

    view.webContents.session.webRequest.onCompleted({urls}, details => {
        if(exclude && exclude(details)) return

        views[id].completeds.push(details.url)
        if(views[id].requests.length === views[id].completeds.length){
            clearTimeout(timeoutRead)
            reader(10)
        }
    })
    view.webContents.session.webRequest.onErrorOccurred({urls}, details => {
        if(exclude && exclude(details)) return

        views[id].completeds.push(details.url)
        if(views[id].requests.length === views[id].completeds.length){
            clearTimeout(timeoutRead)
            reader(10)
        }
    })
    return views[id]
}
module.exports.createView = createView

app.on('ready',() => {
    createWindow()
})