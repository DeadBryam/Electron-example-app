const { app, BrowserWindow, Menu, ipcMain } = require("electron");
require('dotenv').config();
const url = require("url");
const path = require("path");

if (process.env.NODE_ENV == "development") {
  require("electron-reload")(__dirname, {
    electron: path.join(__dirname, "../node_modules", ".bin", "electron")
  });
}

let mainWindow;
let newProductWindow;

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    }
  });
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "views/index.html"),
      protocol: "file",
      slashes: true
    })
  );

  const mainMenu = Menu.buildFromTemplate(templateMenu);

  mainMenu.on("close", () => {
    app.quit();
  });

  mainWindow.setMenu(mainMenu);
});

ipcMain.on("new-product", (evt, msg) => {
  mainWindow.webContents.send("new-product", msg);
  newProductWindow.close();
});

function createNewProductWindow() {
  newProductWindow = new BrowserWindow({
    width: 400,
    height: 250,
    title: "Agregar nuevo producto",
    modal: true,
    parent: mainWindow,
    webPreferences: {
      nodeIntegration: true
    }
  });

  newProductWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "views/new-product.html"),
      protocol: "file",
      slashes: true
    })
  );

  const menu = Menu.buildFromTemplate(newProductMenu);
  newProductWindow.setMenu(menu);
  newProductWindow.setMenuBarVisibility(false);

  newProductWindow.on("close", () => {
    newProductWindow = null;
  });
}

const templateMenu = [
  {
    label: "File",
    submenu: [
      {
        label: "Nuevo Producto",
        accelerator: "Ctrl + P",
        click: () => {
          createNewProductWindow();
        }
      },
      {
        label: "Remove all",
        click: () => {
          mainWindow.webContents.send("remove-all");
        }
      },
      {
        label: "Exit",
        accelerator: process.platform == "darwin" ? "command+w" : "Ctrl+w",
        click: () => {
          app.quit();
        }
      }
    ]
  }
];

const newProductMenu = [
  {
    label: "Close",
    accelerator: "Ctrl+W",
    click: () => {
      newProductWindow.close();
    }
  }
];

if (process.platform === "darwin") {
  templateMenu.unshift({
    label: app.getName()
  });
}

if (process.env.NODE_ENV == "development") {
  let DevTool = {
    label: "DevMenu",
    submenu: [
      {
        label: "Show/Hide DevTools",
        accelerator: "F12",
        click: (item, focusedWindow) => {
          focusedWindow.toggleDevTools();
        }
      },
      {
        role: "reload"
      }
    ]
  };

  templateMenu.push(DevTool);
  newProductMenu.push(DevTool);
}
