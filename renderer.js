// 渲染进程脚本

// 获取 DOM 元素
const sayHelloBtn = document.getElementById('sayHello');
const showTimeBtn = document.getElementById('showTime');
const closeAppBtn = document.getElementById('closeApp');
const outputDiv = document.getElementById('output');
const uploadImageBtn = document.getElementById('uploadImage');
const uploadVideoBtn = document.getElementById('uploadVideo');
const previewContainer = document.getElementById('previewContainer');

// 打招呼按钮点击事件
sayHelloBtn.addEventListener('click', () => {
  outputDiv.textContent = '你好！欢迎使用 Electron 桌面应用！';
});

// 显示时间按钮点击事件
showTimeBtn.addEventListener('click', () => {
  const now = new Date();
  outputDiv.textContent = `当前时间：${now.toLocaleString()}`;
});

// 关闭应用按钮点击事件
closeAppBtn.addEventListener('click', () => {
  if (confirm('确定要关闭应用吗？')) {
    // 通过 Electron API 关闭应用
    if (window.electronAPI) {
      window.electronAPI.sendMessage('close-app');
    } else {
      // 如果 Electron API 不可用，使用 window.close()
      window.close();
    }
  }
});

// 上传图片按钮点击事件
if (uploadImageBtn) {
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
            <h3>图片预览</h3>
            <img src="${event.target.result}" style="max-width: 100%; max-height: 400px; object-fit: contain;">
          `;
          outputDiv.textContent = `已上传图片：${file.name}`;
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  });
}

// 上传视频按钮点击事件
if (uploadVideoBtn) {
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
            <h3>视频预览</h3>
            <video controls style="max-width: 100%; max-height: 400px;">
              <source src="${event.target.result}" type="${file.type}">
              您的浏览器不支持视频播放。
            </video>
          `;
          outputDiv.textContent = `已上传视频：${file.name}`;
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  });
}
