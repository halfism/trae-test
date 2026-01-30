# Electron 桌面 GUI 应用

## 项目介绍

这是一个基于 Electron 框架开发的跨平台桌面 GUI 应用，提供了简洁的用户界面和基本交互功能。应用采用 Electron 的主进程与渲染进程架构，实现了窗口管理、界面交互和进程间通信等核心功能。

## 功能特性

- **简洁界面**：现代化的用户界面设计，响应式布局
- **基本交互**：包含三个核心功能按钮
  - 打招呼：显示欢迎信息
  - 显示时间：展示当前系统时间
  - 关闭应用：安全退出应用程序
- **实时反馈**：操作结果实时显示在输出区域
- **跨平台兼容**：支持 Windows、macOS 和 Linux 操作系统
- **多开支持**：允许同时运行多个应用实例，提高工作效率

## 技术架构

### Electron 架构
- **主进程** (`main.js`)：负责窗口管理和应用生命周期
- **渲染进程** (`index.html`)：负责 GUI 界面与用户交互
- **预加载脚本** (`preload.js`)：实现主进程与渲染进程安全通信

### 技术栈
- Electron ^28.0.0
- HTML5 / CSS3 / JavaScript
- Node.js

## 安装与运行

### 环境要求
- Node.js 16.0.0 或更高版本
- npm 7.0.0 或更高版本

### 安装步骤

1. **克隆项目**
   ```bash
   git clone <项目仓库地址>
   cd <项目目录>
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

   > 注意：如果遇到依赖安装问题，可以尝试使用强制安装命令：
   > ```bash
   > npm install --force
   > ```

### 运行应用

- **开发模式**
  ```bash
  npm start
  ```

- **无弃用警告模式**
  ```bash
  npm run start:no-deprecation
  ```

## 项目结构

```
.
├── .gitignore         # Git 忽略文件配置
├── LICENSE            # 许可证文件
├── README.md          # 项目说明文件
├── index.html         # 渲染进程界面文件
├── main.js            # 主进程文件
├── package-lock.json  # npm 依赖锁定文件
├── package.json       # 项目配置文件
└── preload.js         # 预加载脚本文件
```

## 核心文件说明

### package.json
项目配置文件，定义了项目依赖、脚本命令和元信息。

### main.js
主进程文件，负责创建和管理应用窗口，处理应用生命周期事件。

**多开功能实现**：
- 使用 `windows` 数组存储所有窗口实例
- 移除了默认的单实例锁定机制，允许创建多个应用实例
- 当点击关闭按钮时，只关闭当前窗口而不是退出整个应用
- 在 macOS 上，点击 Dock 图标时会检查是否有窗口存在，没有则创建新窗口

### preload.js
预加载脚本，通过 contextBridge 安全地暴露 Electron API 给渲染进程。

### index.html
渲染进程界面文件，定义了应用的 GUI 结构，包含功能按钮和输出区域。

## 常见问题与解决方案

### 1. "electron 不是内部或外部命令" 错误

**原因**：Electron 依赖未安装。

**解决方案**：运行 `npm install` 安装依赖。

### 2. "Electron failed to install correctly" 错误

**原因**：Electron 安装不完整或损坏。

**解决方案**：
1. 删除 node_modules 目录
   ```bash
   rm -rf node_modules
   # 或在 Windows PowerShell 中
   Remove-Item -Path "node_modules" -Recurse -Force
   ```
2. 强制重新安装依赖
   ```bash
   npm install --force
   ```

### 3. 弃用警告

**原因**：某些依赖包已弃用。

**解决方案**：使用无弃用警告模式启动应用
   ```bash
   npm run start:no-deprecation
   ```

## 许可证

本项目采用 MIT 许可证 - 详情请参阅 [LICENSE](LICENSE) 文件。

## 开发指南

### 添加新功能

1. 在 `index.html` 中添加新的 UI 元素
2. 在适当的位置添加事件监听器和处理逻辑
3. 如果需要主进程与渲染进程通信，在 `preload.js` 中添加相应的 API
4. 在 `main.js` 中处理渲染进程发送的事件

### 构建应用

如需构建可分发的应用包，可以使用 electron-builder 等工具。具体配置请参考 Electron 官方文档。

## 贡献

欢迎提交 Issue 和 Pull Request 来帮助改进这个项目！

## 联系方式

如有问题或建议，请通过以下方式联系：

- 项目仓库：<项目仓库地址>
- 邮箱：<联系邮箱>

---

**版本**: 1.0.0
**最后更新**: 2026-01-25
