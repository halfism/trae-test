const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');

class DatabaseManager {
  constructor() {
    this.db = null;
    this.dbPath = path.join(__dirname, 'data', 'app.db');
    this.dataDir = path.dirname(this.dbPath);
    this.init();
  }
  
  async init() {
    try {
      const SQL = await initSqlJs();
      
      // 创建数据目录
      if (!fs.existsSync(this.dataDir)) {
        fs.mkdirSync(this.dataDir, { recursive: true });
      }
      
      // 检查数据库文件是否存在
      if (fs.existsSync(this.dbPath)) {
        const fileBuffer = fs.readFileSync(this.dbPath);
        this.db = new SQL.Database(fileBuffer);
      } else {
        this.db = new SQL.Database();
        this.initDatabase();
        this.saveDatabase();
      }
    } catch (error) {
      console.error('数据库初始化失败:', error);
      throw error;
    }
  }
  
  initDatabase() {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        nickname TEXT,
        email TEXT,
        phone TEXT,
        avatar TEXT,
        status INTEGER DEFAULT 1,
        create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
        update_time DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_login_time DATETIME,
        last_login_ip TEXT
      );
      
      CREATE TABLE IF NOT EXISTS user_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        username TEXT,
        action TEXT,
        ip TEXT,
        user_agent TEXT,
        create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
      
      CREATE TABLE IF NOT EXISTS system_config (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        config_key TEXT UNIQUE NOT NULL,
        config_value TEXT,
        config_type TEXT DEFAULT 'string',
        description TEXT,
        create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
        update_time DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    this.insertDefaultAdmin();
  }
  
  insertDefaultAdmin() {
    const result = this.db.exec('SELECT * FROM users WHERE username = ?', ['admin']);
    if (result.length === 0 || result[0].values.length === 0) {
      this.db.run(`
        INSERT INTO users (username, password, nickname, email, phone, status)
        VALUES (?, ?, ?, ?, ?, ?)
      `, ['admin', 'admin123', '管理员', 'admin@example.com', '13800138000', 1]);
    }
  }
  
  saveDatabase() {
    if (this.db) {
      const data = this.db.export();
      const buffer = Buffer.from(data);
      fs.writeFileSync(this.dbPath, buffer);
    }
  }
  
  register(username, password, nickname, email, phone) {
    try {
      this.db.run(`
        INSERT INTO users (username, password, nickname, email, phone)
        VALUES (?, ?, ?, ?, ?)
      `, [username, password, nickname || username, email, phone]);
      
      this.saveDatabase();
      
      const result = this.db.exec('SELECT last_insert_rowid() as id');
      const userId = result[0].values[0][0];
      
      return { success: true, userId };
    } catch (error) {
      if (error.message.includes('UNIQUE constraint failed')) {
        return { success: false, message: '用户名已存在' };
      }
      return { success: false, message: error.message };
    }
  }
  
  login(username, password, ip) {
    try {
      const result = this.db.exec(`
        SELECT * FROM users WHERE username = ? AND password = ?
      `, [username, password]);
      
      if (result.length > 0 && result[0].values.length > 0) {
        const columns = result[0].columns;
        const values = result[0].values[0];
        const user = {};
        columns.forEach((col, index) => {
          user[col] = values[index];
        });
        
        if (user.status !== 1) {
          return { success: false, message: '账号已被禁用' };
        }
        
        this.db.run(`
          UPDATE users SET last_login_time = CURRENT_TIMESTAMP, last_login_ip = ?
          WHERE id = ?
        `, [ip, user.id]);
        
        this.db.run(`
          INSERT INTO user_logs (user_id, username, action, ip)
          VALUES (?, ?, ?, ?)
        `, [user.id, user.username, '登录', ip]);
        
        this.saveDatabase();
        
        const { password: _, ...userWithoutPassword } = user;
        return { success: true, user: userWithoutPassword };
      }
      
      return { success: false, message: '用户名或密码错误' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
  
  getUserById(userId) {
    try {
      const result = this.db.exec(`
        SELECT id, username, nickname, email, phone, avatar, status, create_time, last_login_time 
        FROM users WHERE id = ?
      `, [userId]);
      
      if (result.length > 0 && result[0].values.length > 0) {
        const columns = result[0].columns;
        const values = result[0].values[0];
        const user = {};
        columns.forEach((col, index) => {
          user[col] = values[index];
        });
        return user;
      }
      
      return null;
    } catch (error) {
      console.error('获取用户信息失败:', error);
      return null;
    }
  }
  
  updateUser(userId, data) {
    try {
      const fields = [];
      const values = [];
      
      if (data.nickname) { fields.push('nickname = ?'); values.push(data.nickname); }
      if (data.email) { fields.push('email = ?'); values.push(data.email); }
      if (data.phone) { fields.push('phone = ?'); values.push(data.phone); }
      if (data.avatar) { fields.push('avatar = ?'); values.push(data.avatar); }
      if (data.password) { fields.push('password = ?'); values.push(data.password); }
      
      if (fields.length === 0) {
        return { success: false, message: '没有要更新的字段' };
      }
      
      fields.push('update_time = CURRENT_TIMESTAMP');
      values.push(userId);
      
      this.db.run(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
      this.saveDatabase();
      
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
  
  changePassword(userId, oldPassword, newPassword) {
    try {
      const result = this.db.exec('SELECT * FROM users WHERE id = ? AND password = ?', [userId, oldPassword]);
      
      if (result.length === 0 || result[0].values.length === 0) {
        return { success: false, message: '原密码错误' };
      }
      
      this.db.run('UPDATE users SET password = ?, update_time = CURRENT_TIMESTAMP WHERE id = ?', [newPassword, userId]);
      this.saveDatabase();
      
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
  
  getUserLogs(userId, limit = 10) {
    try {
      const result = this.db.exec(`
        SELECT * FROM user_logs 
        WHERE user_id = ? 
        ORDER BY create_time DESC 
        LIMIT ?
      `, [userId, limit]);
      
      if (result.length > 0) {
        const columns = result[0].columns;
        return result[0].values.map(values => {
          const log = {};
          columns.forEach((col, index) => {
            log[col] = values[index];
          });
          return log;
        });
      }
      
      return [];
    } catch (error) {
      console.error('获取用户日志失败:', error);
      return [];
    }
  }
  
  close() {
    if (this.db) {
      this.saveDatabase();
      this.db.close();
    }
  }
}

module.exports = DatabaseManager;