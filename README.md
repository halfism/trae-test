# 催化剂加 - Electron 桌面 GUI 应用

## 项目介绍

这是一个基于 Electron 框架开发的跨平台桌面 GUI 应用，参考了 RuoYi 后台管理系统的界面风格。应用采用 Electron 的主进程与渲染进程架构，集成了 SQLite 数据库，实现了用户认证、数据持久化、界面交互和进程间通信等核心功能。

## 功能特性

- **RuoYi 风格界面**：参考 RuoYi 后台管理系统，采用现代化设计
- **用户认证系统**：
  - 用户注册和登录功能
  - 用户会话管理
  - 默认管理员账号（admin / admin123）
- **数据库集成**：使用 SQLite 数据库实现数据持久化存储
- **左侧菜单导航**：支持多个功能模块的快速切换
- **媒体预览**：支持图片和视频的上传与预览
- **AI 工具展示**：展示 AI 洞察、Copilot 智能对话等功能
- **多开支持**：允许同时运行多个应用实例，提高工作效率
- **跨平台兼容**：支持 Windows、macOS 和 Linux 操作系统
- **响应式设计**：支持不同屏幕尺寸的自适应布局

## 技术架构

### Electron 架构
- **主进程** (`main.js`)：负责窗口管理和应用生命周期
- **渲染进程** (`index.html`)：负责 GUI 界面与用户交互
- **预加载脚本** (`preload.js`)：实现主进程与渲染进程安全通信

### 技术栈
- Electron ^28.0.0
- SQLite (sql.js)
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
electron-desktop-app/
├── src/                  # 源代码目录
│   ├── main/             # 主进程代码
│   │   └── main.js       # 主入口文件
│   ├── renderer/         # 渲染进程代码
│   │   ├── pages/        # 页面文件
│   │   │   ├── login.html    # 登录页面
│   │   │   └── main.html     # 主界面
│   │   ├── scripts/      # 脚本文件
│   │   │   ├── login.js      # 登录相关脚本
│   │   │   └── main-interface.js # 主界面脚本
│   │   ├── components/   # 组件目录
│   │   ├── styles/       # 样式文件
│   │   └── preload.js    # 预加载脚本
│   ├── common/           # 公共代码
│   │   └── database.js   # 数据库管理
│   └── utils/            # 工具函数
├── data/                 # 数据目录
│   └── app.db            # SQLite 数据库文件
├── assets/               # 静态资源
├── build/                # 构建输出
├── .gitignore            # Git 忽略文件配置
├── LICENSE               # 许可证文件
├── README.md             # 项目说明文件
├── package-lock.json     # npm 依赖锁定文件
└── package.json          # 项目配置文件
```

## 核心文件说明

### package.json
项目配置文件，定义了项目依赖、脚本命令和元信息。

### src/main/main.js
主进程文件，负责创建和管理应用窗口，处理应用生命周期事件。

**核心功能**：
- 数据库初始化和管理
- IPC 通信处理（注册、登录、用户信息管理等）
- 窗口管理和多开支持

### src/common/database.js
数据库管理类，封装了 SQLite 数据库操作。

**功能**：
- 数据库初始化和表结构创建
- 用户注册和登录
- 用户信息查询和更新
- 密码修改
- 用户操作日志记录

### src/renderer/pages/login.html & src/renderer/scripts/login.js
登录和注册界面，采用 RuoYi 风格设计。

**功能**：
- 用户登录表单
- 用户注册表单
- 表单验证
- 错误提示和加载状态

### src/renderer/pages/main.html & src/renderer/scripts/main-interface.js
主界面，包含左侧菜单栏和多个功能模块。

**功能模块**：
- 控制台：系统信息展示
- 用户管理：用户信息管理
- 媒体预览：图片和视频预览
- AI 工具：AI 功能展示
- 系统设置：系统配置管理

### src/renderer/preload.js
预加载脚本，通过 contextBridge 安全地暴露 Electron API 给渲染进程。

**暴露的 API**：
- sendMessage / onResponse：消息通信
- register：用户注册
- login：用户登录
- getUserInfo：获取用户信息
- updateUser：更新用户信息
- changePassword：修改密码
- getUserLogs：获取用户日志

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

### 3. 注册或登录失败："Cannot read properties of undefined (reading 'register/login')"

**原因**：preload.js 的 contextBridge 配置问题。

**解决方案**：
- 确保应用已正确启动
- 检查浏览器控制台是否有错误信息
- 尝试重启应用

### 4. 弃用警告

**原因**：某些依赖包已弃用。

**解决方案**：使用无弃用警告模式启动应用
   ```bash
   npm run start:no-deprecation
   ```

### 5. 数据库相关错误

**原因**：数据库文件权限或初始化问题。

**解决方案**：
- 确保应用有写入 `data` 目录的权限
- 删除 `data/app.db` 文件后重新启动应用
- 检查数据库文件是否损坏

## 使用说明

### 首次使用

1. 启动应用后，会显示登录界面
2. 使用默认管理员账号登录：
   - 用户名：`admin`
   - 密码：`admin123`
3. 登录成功后，进入主界面，可以使用各项功能

### 注册新用户

1. 在登录界面点击"注册"标签
2. 填写用户名、密码等信息
3. 点击"注册"按钮
4. 注册成功后，切换到"登录"标签进行登录

### 功能模块说明

- **控制台**：显示系统信息和当前用户信息
- **用户管理**：管理用户信息（开发中）
- **媒体预览**：上传和预览图片、视频文件
- **AI 工具**：展示 AI 相关功能特性
- **系统设置**：系统配置管理（开发中）

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
