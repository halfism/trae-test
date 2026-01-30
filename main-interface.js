// 主界面交互逻辑

let currentUser = null;

// 初始化
function init() {
  loadCurrentUser();
  setupMenuNavigation();
  setupSidebarToggle();
  setupLogout();
  setupMediaUpload();
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

// 页面加载时初始化
window.addEventListener('load', init);