document.addEventListener('DOMContentLoaded', function() {
  // 表单切换
  const formTabs = document.querySelectorAll('.form-tab');
  const formContents = document.querySelectorAll('.form-content');
  
  formTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const target = this.getAttribute('data-target');
      
      // 切换标签
      formTabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      
      // 切换内容
      formContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === target) {
          content.classList.add('active');
        }
      });
    });
  });
  
  // 登录表单
  const loginForm = {
    username: document.getElementById('login-username'),
    password: document.getElementById('login-password'),
    btn: document.getElementById('login-btn'),
    error: document.getElementById('login-error'),
    success: document.getElementById('login-success')
  };
  
  // 注册表单
  const registerForm = {
    username: document.getElementById('register-username'),
    password: document.getElementById('register-password'),
    nickname: document.getElementById('register-nickname'),
    email: document.getElementById('register-email'),
    phone: document.getElementById('register-phone'),
    btn: document.getElementById('register-btn'),
    error: document.getElementById('register-error'),
    success: document.getElementById('register-success')
  };
  
  // 登录按钮点击事件
  loginForm.btn.addEventListener('click', async function() {
    // 清空消息
    loginForm.error.textContent = '';
    loginForm.success.textContent = '';
    
    // 获取表单数据
    const username = loginForm.username.value.trim();
    const password = loginForm.password.value.trim();
    
    // 验证表单
    if (!username) {
      loginForm.error.textContent = '请输入用户名';
      return;
    }
    if (!password) {
      loginForm.error.textContent = '请输入密码';
      return;
    }
    
    try {
      // 调用登录API
      const result = await window.electronAPI.login({ username, password });
      
      if (result.success) {
        // 登录成功，跳转到主界面
        window.location.href = 'main.html';
      } else {
        // 登录失败
        loginForm.error.textContent = result.message;
      }
    } catch (error) {
      console.error('登录失败:', error);
      loginForm.error.textContent = '登录失败，请稍后重试';
    }
  });
  
  // 注册按钮点击事件
  registerForm.btn.addEventListener('click', async function() {
    // 清空消息
    registerForm.error.textContent = '';
    registerForm.success.textContent = '';
    
    // 获取表单数据
    const username = registerForm.username.value.trim();
    const password = registerForm.password.value.trim();
    const nickname = registerForm.nickname.value.trim();
    const email = registerForm.email.value.trim();
    const phone = registerForm.phone.value.trim();
    
    // 验证表单
    if (!username) {
      registerForm.error.textContent = '请输入用户名';
      return;
    }
    if (!password) {
      registerForm.error.textContent = '请输入密码';
      return;
    }
    if (!nickname) {
      registerForm.error.textContent = '请输入昵称';
      return;
    }
    
    try {
      // 调用注册API
      const result = await window.electronAPI.register({ 
        username, 
        password, 
        nickname, 
        email, 
        phone 
      });
      
      if (result.success) {
        // 注册成功
        registerForm.success.textContent = '注册成功，请登录';
        // 切换到登录表单
        formTabs[0].click();
      } else {
        // 注册失败
        registerForm.error.textContent = result.message;
      }
    } catch (error) {
      console.error('注册失败:', error);
      registerForm.error.textContent = '注册失败，请稍后重试';
    }
  });
});