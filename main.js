const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// 移除单实例锁定，允许多开
// 注意：在某些 Electron 版本中，默认就是多实例的

// 存储所有窗口实例
const windows = [];

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // 添加到窗口数组
  windows.push(mainWindow);

  mainWindow.loadFile('index.html');
  mainWindow.on('closed', function() {
    // 从数组中移除
    const index = windows.indexOf(mainWindow);
    if (index !== -1) {
      windows.splice(index, 1);
    }
  });
}

// 当 Electron 完成初始化并准备创建浏览器窗口时调用
app.on('ready', createWindow);

// 当所有窗口关闭时退出应用（Windows & Linux）
app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 在 macOS 上，点击 Dock 图标时重新创建窗口
app.on('activate', function() {
  if (windows.length === 0) {
    createWindow();
  }
});

// 处理来自渲染进程的消息
ipcMain.on('message', (event, message) => {
  if (message === 'close-app') {
    // 关闭当前窗口而不是退出整个应用
    const window = BrowserWindow.fromWebContents(event.sender);
    if (window) {
      window.close();
    }
  }
});
