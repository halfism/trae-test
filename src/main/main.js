const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const DatabaseManager = require('../common/database');

// 移除单实例锁定，允许多开
// 注意：在某些 Electron 版本中，默认就是多实例的

// 存储所有窗口实例
const windows = [];

// 初始化数据库
let db = null;

async function initDatabase() {
  const DatabaseManager = require('../common/database');
  db = new DatabaseManager();
  await db.init();
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, '../renderer/preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // 添加到窗口数组
  windows.push(mainWindow);

  mainWindow.loadFile(path.join(__dirname, '../renderer/pages/login.html'));
  
  // 打开开发者工具进行调试
  mainWindow.webContents.openDevTools();
  
  mainWindow.on('closed', function() {
    // 从数组中移除
    const index = windows.indexOf(mainWindow);
    if (index !== -1) {
      windows.splice(index, 1);
    }
  });
}

// 当 Electron 完成初始化并准备创建浏览器窗口时调用
app.on('ready', async () => {
  await initDatabase();
  createWindow();
});

// 当所有窗口关闭时退出应用（Windows & Linux）
app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
    db.close();
    app.quit();
  }
});

// 在 macOS 上，点击 Dock 图标时重新创建窗口
app.on('activate', function() {
  if (windows.length === 0) {
    createWindow();
  }
});

// IPC 通信处理
ipcMain.on('message', (event, message) => {
  if (message === 'close-app') {
    // 关闭当前窗口而不是退出整个应用
    const window = BrowserWindow.fromWebContents(event.sender);
    if (window) {
      window.close();
    }
  }
});

// 用户注册
ipcMain.handle('register', async (event, userData) => {
  if (!db) return { success: false, message: '数据库未初始化' };
  const { username, password, nickname, email, phone } = userData;
  return db.register(username, password, nickname, email, phone);
});

// 用户登录
ipcMain.handle('login', async (event, loginData) => {
  if (!db) return { success: false, message: '数据库未初始化' };
  const { username, password } = loginData;
  return db.login(username, password, '127.0.0.1');
});

// 获取用户信息
ipcMain.handle('getUserInfo', async (event, userId) => {
  if (!db) return null;
  return db.getUserById(userId);
});

// 更新用户信息
ipcMain.handle('updateUser', async (event, userId, userData) => {
  if (!db) return { success: false, message: '数据库未初始化' };
  return db.updateUser(userId, userData);
});

// 修改密码
ipcMain.handle('changePassword', async (event, userId, oldPassword, newPassword) => {
  if (!db) return { success: false, message: '数据库未初始化' };
  return db.changePassword(userId, oldPassword, newPassword);
});

// 获取用户日志
ipcMain.handle('getUserLogs', async (event, userId, limit) => {
  if (!db) return [];
  return db.getUserLogs(userId, limit);
});