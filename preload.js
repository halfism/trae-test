const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  sendMessage: (message) => ipcRenderer.send('message', message),
  onResponse: (callback) => ipcRenderer.on('response', (event, ...args) => callback(...args)),
  
  // 用户注册
  register: (userData) => ipcRenderer.invoke('register', userData),
  
  // 用户登录
  login: (loginData) => ipcRenderer.invoke('login', loginData),
  
  // 获取用户信息
  getUserInfo: (userId) => ipcRenderer.invoke('getUserInfo', userId),
  
  // 更新用户信息
  updateUser: (userId, userData) => ipcRenderer.invoke('updateUser', userId, userData),
  
  // 修改密码
  changePassword: (userId, oldPassword, newPassword) => ipcRenderer.invoke('changePassword', userId, oldPassword, newPassword),
  
  // 获取用户日志
  getUserLogs: (userId, limit) => ipcRenderer.invoke('getUserLogs', userId, limit)
});
