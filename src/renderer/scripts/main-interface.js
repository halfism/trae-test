document.addEventListener('DOMContentLoaded', function() {
  // 当前用户ID
  let currentUserId = 1; // 默认值，实际应从登录状态获取
  
  // 导航菜单
  const navItems = document.querySelectorAll('.nav-item[data-section]');
  const contentSections = document.querySelectorAll('.content-section');
  
  // 导航切换
  navItems.forEach(item => {
    item.addEventListener('click', function() {
      const sectionId = this.getAttribute('data-section');
      
      // 更新导航状态
      navItems.forEach(nav => nav.classList.remove('active'));
      this.classList.add('active');
      
      // 更新内容区域
      contentSections.forEach(section => {
        section.style.display = 'none';
      });
      document.getElementById(`${sectionId}-section`).style.display = 'block';
      
      // 更新页面标题
      document.querySelector('.header h1').textContent = this.querySelector('span').textContent;
      
      // 加载对应内容
      if (sectionId === 'logs') {
        loadUserLogs();
      }
    });
  });
  
  // 加载用户信息
  async function loadUserInfo() {
    try {
      const userInfo = await window.electronAPI.getUserInfo(currentUserId);
      if (userInfo) {
        // 更新侧边栏用户信息
        document.getElementById('user-username').textContent = userInfo.username;
        document.getElementById('user-email').textContent = userInfo.email || '未设置';
        document.getElementById('user-avatar').textContent = userInfo.username.charAt(0).toUpperCase();
        
        // 更新仪表盘用户信息
        document.getElementById('dashboard-username').textContent = userInfo.username;
        document.getElementById('dashboard-nickname').textContent = userInfo.nickname || '未设置';
        document.getElementById('dashboard-email').textContent = userInfo.email || '未设置';
        document.getElementById('dashboard-phone').textContent = userInfo.phone || '未设置';
        document.getElementById('dashboard-create-time').textContent = userInfo.create_time || '未知';
        document.getElementById('dashboard-last-login').textContent = userInfo.last_login_time || '从未登录';
        
        // 更新个人资料表单
        document.getElementById('profile-username').value = userInfo.username;
        document.getElementById('profile-nickname').value = userInfo.nickname || '';
        document.getElementById('profile-email').value = userInfo.email || '';
        document.getElementById('profile-phone').value = userInfo.phone || '';
      }
    } catch (error) {
      console.error('加载用户信息失败:', error);
    }
  }
  
  // 加载用户日志
  async function loadUserLogs() {
    try {
      const logs = await window.electronAPI.getUserLogs(currentUserId, 50);
      const logsContainer = document.getElementById('logs-container');
      logsContainer.innerHTML = '';
      
      if (logs.length === 0) {
        logsContainer.innerHTML = '<div class="log-item">暂无操作日志</div>';
        return;
      }
      
      logs.forEach(log => {
        const logItem = document.createElement('div');
        logItem.className = 'log-item';
        logItem.innerHTML = `
          <span class="log-time">${log.create_time}</span>
          <span class="log-action">${log.action}</span>
          <span class="log-ip">IP: ${log.ip}</span>
        `;
        logsContainer.appendChild(logItem);
      });
    } catch (error) {
      console.error('加载用户日志失败:', error);
    }
  }
  
  // 保存个人资料
  document.getElementById('save-profile-btn').addEventListener('click', async function() {
    const nickname = document.getElementById('profile-nickname').value.trim();
    const email = document.getElementById('profile-email').value.trim();
    const phone = document.getElementById('profile-phone').value.trim();
    
    try {
      const result = await window.electronAPI.updateUser(currentUserId, {
        nickname,
        email,
        phone
      });
      
      if (result.success) {
        alert('个人资料更新成功');
        loadUserInfo();
      } else {
        alert('更新失败: ' + result.message);
      }
    } catch (error) {
      console.error('更新个人资料失败:', error);
      alert('更新失败，请稍后重试');
    }
  });
  
  // 取消个人资料编辑
  document.getElementById('cancel-profile-btn').addEventListener('click', function() {
    loadUserInfo();
  });
  
  // 保存密码
  document.getElementById('save-password-btn').addEventListener('click', async function() {
    const oldPassword = document.getElementById('old-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    if (newPassword !== confirmPassword) {
      alert('两次输入的新密码不一致');
      return;
    }
    
    try {
      const result = await window.electronAPI.changePassword(currentUserId, oldPassword, newPassword);
      
      if (result.success) {
        alert('密码修改成功');
        // 清空表单
        document.getElementById('old-password').value = '';
        document.getElementById('new-password').value = '';
        document.getElementById('confirm-password').value = '';
      } else {
        alert('修改失败: ' + result.message);
      }
    } catch (error) {
      console.error('修改密码失败:', error);
      alert('修改失败，请稍后重试');
    }
  });
  
  // 取消密码修改
  document.getElementById('cancel-password-btn').addEventListener('click', function() {
    document.getElementById('old-password').value = '';
    document.getElementById('new-password').value = '';
    document.getElementById('confirm-password').value = '';
  });
  
  // 退出登录
  document.getElementById('logout-btn').addEventListener('click', function() {
    if (confirm('确定要退出登录吗？')) {
      window.location.href = 'login.html';
    }
  });
  
  // 刷新按钮
  document.getElementById('refresh-btn').addEventListener('click', function() {
    loadUserInfo();
    alert('页面已刷新');
  });
  
  // 添加按钮（示例功能）
  document.getElementById('add-btn').addEventListener('click', function() {
    alert('添加功能开发中...');
  });
  
  // 初始加载
  loadUserInfo();
});