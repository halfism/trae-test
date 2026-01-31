// 主界面交互逻辑

let currentUser = null;
let currentSettings = {};

// 初始化
function init() {
  loadCurrentUser();
  setupMenuNavigation();
  setupSidebarToggle();
  setupLogout();
  setupMediaUpload();
  setupSettingsTabs();
  setupSettingsSave();
  loadSettings();
  updateSystemInfo();
  updateTime();
  setInterval(updateTime, 1000);
}

// 加载当前用户信息
function loadCurrentUser() {
  const savedUser = localStorage.getItem('currentUser');
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    updateUserInfo();
  } else {
    window.location.href = 'login.html';
  }
}

// 更新用户信息显示
function updateUserInfo() {
  if (currentUser) {
    const userName = document.getElementById('userName');
    const userRole = document.getElementById('userRole');
    const userAvatar = document.getElementById('userAvatar');
    const dashboardUserName = document.getElementById('dashboardUserName');
    
    if (userName) userName.textContent = currentUser.nickname || currentUser.username;
    if (userRole) userRole.textContent = '系统用户';
    if (userAvatar) userAvatar.textContent = (currentUser.nickname || currentUser.username).charAt(0).toUpperCase();
    if (dashboardUserName) dashboardUserName.textContent = currentUser.nickname || currentUser.username;
  }
}

// 设置菜单导航
function setupMenuNavigation() {
  const menuItems = document.querySelectorAll('.menu-item[data-page]');
  const pages = document.querySelectorAll('.page');
  const currentPageSpan = document.getElementById('currentPage');
  
  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      const pageName = item.dataset.page;
      const pageText = item.querySelector('.menu-item-text').textContent;
      
      // 更新菜单项状态
      menuItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      
      // 更新页面显示
      pages.forEach(page => page.classList.remove('active'));
      const targetPage = document.getElementById(`page-${pageName}`);
      if (targetPage) {
        targetPage.classList.add('active');
      }
      
      // 更新面包屑
      if (currentPageSpan) {
        currentPageSpan.textContent = pageText;
      }
    });
  });
}

// 设置侧边栏切换
function setupSidebarToggle() {
  const toggleBtn = document.getElementById('toggleSidebar');
  const sidebar = document.querySelector('.sidebar');
  
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
    });
  }
}

// 设置退出登录
function setupLogout() {
  const logoutBtn = document.getElementById('logoutBtn');
  
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (confirm('确定要退出登录吗？')) {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
      }
    });
  }
}

// 设置媒体上传功能
function setupMediaUpload() {
  const uploadImageBtn = document.getElementById('uploadImageBtn');
  const uploadVideoBtn = document.getElementById('uploadVideoBtn');
  const previewContainer = document.getElementById('previewContainer');
  
  if (uploadImageBtn && previewContainer) {
    uploadImageBtn.addEventListener('click', () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            previewContainer.innerHTML = `
              <div style="width: 100%;">
                <h3 style="margin-bottom: 15px; color: #303133;">图片预览</h3>
                <img src="${event.target.result}" style="max-width: 100%; max-height: 400px; object-fit: contain; border-radius: 4px; box-shadow: 0 2px 12px rgba(0,0,0,0.1);">
                <p style="margin-top: 10px; color: #606266; font-size: 14px;">文件名：${file.name}</p>
              </div>
            `;
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    });
  }
  
  if (uploadVideoBtn && previewContainer) {
    uploadVideoBtn.addEventListener('click', () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'video/*';
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            previewContainer.innerHTML = `
              <div style="width: 100%;">
                <h3 style="margin-bottom: 15px; color: #303133;">视频预览</h3>
                <video controls style="max-width: 100%; max-height: 400px; border-radius: 4px; box-shadow: 0 2px 12px rgba(0,0,0,0.1);">
                  <source src="${event.target.result}" type="${file.type}">
                  您的浏览器不支持视频播放。
                </video>
                <p style="margin-top: 10px; color: #606266; font-size: 14px;">文件名：${file.name}</p>
              </div>
            `;
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    });
  }
}

// 更新时间显示
function updateTime() {
  const currentTimeSpan = document.getElementById('currentTime');
  if (currentTimeSpan) {
    const now = new Date();
    const options = { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    };
    currentTimeSpan.textContent = now.toLocaleString('zh-CN', options);
  }
}

// 设置选项卡切换
function setupSettingsTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.settings-tab-content');
  
  if (tabBtns.length > 0 && tabContents.length > 0) {
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabName = btn.dataset.tab;
        
        // 更新选项卡按钮状态
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // 更新内容显示
        tabContents.forEach(content => content.classList.remove('active'));
        const targetContent = document.getElementById(`tab-${tabName}`);
        if (targetContent) {
          targetContent.classList.add('active');
        }
      });
    });
  }
}

// 设置保存功能
function setupSettingsSave() {
  const saveBtn = document.getElementById('save-settings-btn');
  
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      saveSettings();
      alert('设置已保存！');
    });
  }
}

// 加载设置
function loadSettings() {
  const savedSettings = localStorage.getItem('appSettings');
  if (savedSettings) {
    currentSettings = JSON.parse(savedSettings);
    applySettings();
  } else {
    // 设置默认值
    currentSettings = {
      theme: 'default',
      language: 'zh-CN',
      notification: true,
      autoUpdate: true,
      startup: false,
      windowSize: { width: 1000, height: 800 },
      multiInstance: true,
      devTools: true,
      dbPath: './data/database.sqlite',
      dbBackup: true,
      backupInterval: 7,
      logLevel: 'info'
    };
    saveSettings();
    applySettings();
  }
}

// 保存设置
function saveSettings() {
  // 从表单中获取设置值
  currentSettings = {
    theme: document.getElementById('theme-select')?.value || 'default',
    language: document.getElementById('language-select')?.value || 'zh-CN',
    notification: document.getElementById('notification-toggle')?.checked || true,
    autoUpdate: document.getElementById('auto-update-toggle')?.checked || true,
    startup: document.getElementById('startup-toggle')?.checked || false,
    windowSize: {
      width: parseInt(document.getElementById('window-width')?.value || '1000'),
      height: parseInt(document.getElementById('window-height')?.value || '800')
    },
    multiInstance: document.getElementById('multi-instance-toggle')?.checked || true,
    devTools: document.getElementById('dev-tools-toggle')?.checked || true,
    dbPath: document.getElementById('db-path')?.value || './data/database.sqlite',
    dbBackup: document.getElementById('db-backup-toggle')?.checked || true,
    backupInterval: parseInt(document.getElementById('backup-interval')?.value || '7'),
    logLevel: document.getElementById('log-level')?.value || 'info'
  };
  
  localStorage.setItem('appSettings', JSON.stringify(currentSettings));
}

// 应用设置
function applySettings() {
  // 应用主题设置
  if (document.getElementById('theme-select')) {
    document.getElementById('theme-select').value = currentSettings.theme;
  }
  
  // 应用语言设置
  if (document.getElementById('language-select')) {
    document.getElementById('language-select').value = currentSettings.language;
  }
  
  // 应用通知设置
  if (document.getElementById('notification-toggle')) {
    document.getElementById('notification-toggle').checked = currentSettings.notification;
  }
  
  // 应用自动更新设置
  if (document.getElementById('auto-update-toggle')) {
    document.getElementById('auto-update-toggle').checked = currentSettings.autoUpdate;
  }
  
  // 应用开机自启设置
  if (document.getElementById('startup-toggle')) {
    document.getElementById('startup-toggle').checked = currentSettings.startup;
  }
  
  // 应用窗口大小设置
  if (document.getElementById('window-width')) {
    document.getElementById('window-width').value = currentSettings.windowSize.width;
  }
  if (document.getElementById('window-height')) {
    document.getElementById('window-height').value = currentSettings.windowSize.height;
  }
  
  // 应用多开设置
  if (document.getElementById('multi-instance-toggle')) {
    document.getElementById('multi-instance-toggle').checked = currentSettings.multiInstance;
  }
  
  // 应用开发工具设置
  if (document.getElementById('dev-tools-toggle')) {
    document.getElementById('dev-tools-toggle').checked = currentSettings.devTools;
  }
  
  // 应用数据库路径设置
  if (document.getElementById('db-path')) {
    document.getElementById('db-path').value = currentSettings.dbPath;
  }
  
  // 应用数据库备份设置
  if (document.getElementById('db-backup-toggle')) {
    document.getElementById('db-backup-toggle').checked = currentSettings.dbBackup;
  }
  
  // 应用备份间隔设置
  if (document.getElementById('backup-interval')) {
    document.getElementById('backup-interval').value = currentSettings.backupInterval;
  }
  
  // 应用日志级别设置
  if (document.getElementById('log-level')) {
    document.getElementById('log-level').value = currentSettings.logLevel;
  }
}

// 更新系统信息
function updateSystemInfo() {
  // 在实际应用中，这些信息可以通过 Electron 的 API 获取
  // 这里我们使用模拟数据
  document.getElementById('app-version')?.textContent = '1.0.0';
  document.getElementById('electron-version')?.textContent = '28.0.0';
  
  // 获取操作系统信息
  const osInfo = navigator.platform || 'Unknown';
  document.getElementById('os-info')?.textContent = osInfo;
  
  // 模拟处理器信息
  document.getElementById('cpu-info')?.textContent = 'Intel Core i7';
  
  // 模拟内存信息
  document.getElementById('memory-info')?.textContent = '16GB';
}

// 页面加载时初始化
window.addEventListener('load', init);