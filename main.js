// 引入electron并创建一个Browserwindow
const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');
const url = require('url');

// 保持window对象的全局引用,避免JavaScript对象被垃圾回收时,窗口被自动关闭.
let mainWindow;

function createWindow() {
  //创建浏览器窗口,宽高自定义具体大小你开心就好
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      backgroundThrottling: false,
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
      preload: path.join(__dirname, './public/renderer.js'),
    },
  });

  if (process.env.NODE_ENV === 'production') {
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, 'build/index.html'),
        protocol: 'file:',
        slashes: true,
      }),
    );
  } else {
    mainWindow.loadURL('http://localhost:3000/');
  }

  // 打开开发者工具，默认不打开
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  // 关闭window时触发下列事件.
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

// 当 Electron 完成初始化并准备创建浏览器窗口时调用此方法
app.on('ready', createWindow);

// 所有窗口关闭时退出应用.
app.on('window-all-closed', function () {
  // macOS中除非用户按下 `Cmd + Q` 显式退出,否则应用与菜单栏始终处于活动状态.
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // macOS中点击Dock图标时没有已打开的其余应用窗口时,则通常在应用中重建一个窗口
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('asynchronous-message', (evt, args) => {
  const { type, extraMap, eventId } = args;

  switch (type) {
    case 'file-read':
      evt.sender.send('asynchronous-reply', {
        type: 'file-read',
        data: fileReader(extraMap),
        eventId,
      });
      break;
    case 'file-write':
      fileWriter(extraMap);
      evt.sender.send('asynchronous-reply', {
        type: 'file-read',
        data: fileReader(extraMap),
        eventId,
      });
      break;
    default:
      break;
  }
});

const isFileExistOrCreate = ({ dirPath, filename }) => {
  const resolvePath = path.resolve(__dirname, dirPath, filename);

  const file = fs.existsSync(resolvePath);

  if (!file) {
    const dir = dirPath.split('/');
    for (let i = 0; i < dir.length; i++) {
      const dirItemPath = path.resolve(__dirname, ...dir.slice(0, i + 1));

      if (!fs.existsSync(dirItemPath)) {
        fs.mkdirSync(dirItemPath);
      }
    }

    fs.writeFileSync(resolvePath, '', 'utf-8');
  }
};

const fileWriter = ({ dirPath, filename, data }) => {
  isFileExistOrCreate({ dirPath, filename });

  const resolvePath = path.resolve(__dirname, dirPath, filename);

  fs.writeFileSync(resolvePath, data, 'utf-8');
};

const fileReader = ({ dirPath, filename }) => {
  try {
    isFileExistOrCreate({ dirPath, filename });

    const resolvePath = path.resolve(__dirname, dirPath, filename);

    return fs.readFileSync(resolvePath, 'utf-8');
  } catch (error) {
    return '';
  }
};
