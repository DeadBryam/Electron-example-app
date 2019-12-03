const {app, BrowserWindow, Menu} = require('electron');
const url = require('url');
const path = require('path');


if(process.env.NODE_ENV != 'production'){
    require('electron-reload')(__dirname,{});
}

let main;
app.on('ready',()=> {
    main = new BrowserWindow({});
    main.loadURL(url.format({
        pathname: path.join(__dirname, 'views/index.html'),
        protocol: 'file',
        slashes: true
    }));


});