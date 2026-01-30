// 登录和注册功能

const tabs = document.querySelectorAll('.tab');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const alertBox = document.getElementById('alertBox');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');

let currentUser = null;

// 检查 electronAPI 是否可用
console.log('window.electronAPI:', window.electronAPI);

if (!window.electronAPI) {
  console.error('electronAPI 未定义，请检查 preload.js 配置');
  showAlert('系统错误：electronAPI 未加载，请重启应用');
}

// 标签切换
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const tabName = tab.dataset.tab;
    
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    
    loginForm.classList.remove('active');
    registerForm.classList.remove('active');
    
    if (tabName === 'login') {
      loginForm.classList.add('active');
    } else {
      registerForm.classList.add('active');
    }
    
    hideAlert();
  });
});

// 显示提示信息
function showAlert(message, type = 'error') {
  alertBox.textContent = message;
  alertBox.className = `alert alert-${type} show`;
  
  setTimeout(() => {
    hideAlert();
  }, 3000);
}

// 隐藏提示信息
function hideAlert() {
  alertBox.classList.remove('show');
}

// 设置按钮加载状态
function setButtonLoading(button, loading) {
  const span = button.querySelector('span');
  
  if (loading) {
    button.disabled = true;
    const loadingSpan = document.createElement('span');
    loadingSpan.className = 'loading';
    button.insertBefore(loadingSpan, span);
    span.textContent = '处理中...';
  } else {
    button.disabled = false;
    const loadingSpan = button.querySelector('.loading');
    if (loadingSpan) {
      loadingSpan.remove();
    }
    span.textContent = button.id === 'loginBtn' ? '登录' : '注册';
  }
}

// 登录功能
loginBtn.addEventListener('click', async () => {
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value;
  
  if (!username || !password) {
    showAlert('请输入用户名和密码');
    return;
  }
  
  setButtonLoading(loginBtn, true);
  
  try {
    const result = await window.electronAPI.login({ username, password });
    
    if (result.success) {
      currentUser = result.user;
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      showAlert('登录成功！', 'success');
      
      setTimeout(() => {
        window.location.href = 'main.html';
      }, 1000);
    } else {
      showAlert(result.message || '登录失败');
    }
  } catch (error) {
    showAlert('登录失败：' + error.message);
  } finally {
    setButtonLoading(loginBtn, false);
  }
});

// 注册功能
registerBtn.addEventListener('click', async () => {
  const username = document.getElementById('regUsername').value.trim();
  const password = document.getElementById('regPassword').value;
  const confirmPassword = document.getElementById('regConfirmPassword').value;
  const nickname = document.getElementById('regNickname').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const phone = document.getElementById('regPhone').value.trim();
  
  if (!username || !password) {
    showAlert('请输入用户名和密码');
    return;
  }
  
  if (password !== confirmPassword) {
    showAlert('两次输入的密码不一致');
    return;
  }
  
  if (password.length < 6) {
    showAlert('密码长度不能少于6位');
    return;
  }
  
  setButtonLoading(registerBtn, true);
  
  try {
    const result = await window.electronAPI.register({
      username,
      password,
      nickname: nickname || username,
      email,
      phone
    });
    
    if (result.success) {
      showAlert('注册成功！请登录', 'success');
      
      // 清空注册表单
      document.getElementById('regUsername').value = '';
      document.getElementById('regPassword').value = '';
      document.getElementById('regConfirmPassword').value = '';
      document.getElementById('regNickname').value = '';
      document.getElementById('regEmail').value = '';
      document.getElementById('regPhone').value = '';
      
      // 切换到登录标签
      setTimeout(() => {
        tabs[0].click();
      }, 1500);
    } else {
      showAlert(result.message || '注册失败');
    }
  } catch (error) {
    showAlert('注册失败：' + error.message);
  } finally {
    setButtonLoading(registerBtn, false);
  }
});

// 回车键登录
document.getElementById('loginPassword').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    loginBtn.click();
  }
});

// 回车键注册
document.getElementById('regPhone').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    registerBtn.click();
  }
});

// 检查是否已登录
function checkLogin() {
  const savedUser = localStorage.getItem('currentUser');
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    window.location.href = 'main.html';
  }
}

// 页面加载时检查登录状态
window.addEventListener('load', checkLogin);