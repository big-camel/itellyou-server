const os = require('os')
const electron = require('electron')
const { spawn } = require('child_process')
const path = require('path')

let child = null
if(os.type().toLowerCase() === 'linux'){//在服务器上，使用虚拟显示服务器运行 electron 渲染
    child = spawn(path.resolve(__dirname, '../node_modules/.bin/xvfb-maybe'), [
        electron,
        path.resolve(__dirname, 'app.js')
    ],
    {
        stdio: ['ipc']
    })
}else{
    child = spawn(electron, [
        path.resolve(__dirname, 'app.js')
    ],
    {
        stdio: ['ipc']
    })
}

if(child === null){
    console.log("Not loaded electron ")
    return
}

child.stdout.on('data', data => {
    console.log('stdout: ' + data.toString())
})

child.stderr.on('data', data => {
    console.log('stderr: ' + data.toString())
})

child.on('close', code => {
    console.log('child process exited with code ' + code)
})