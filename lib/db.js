const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(process.cwd(), 'database.json');

const DEFAULT_DATA = {
  roles: [
    { id: 1, role_name: 'SuperAdmin' },
    { id: 2, role_name: 'Editor' }
  ],
  users: [
    { 
      id: 1, 
      username: 'admin', 
      password_hash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', // sha256 of 'admin123'
      role_id: 1 
    }
  ],
  projects: []
};

function migrate(data) {
  if (!data.users || data.users.length === 0) data.users = DEFAULT_DATA.users;
  if (!data.roles || data.roles.length === 0) data.roles = DEFAULT_DATA.roles;
  return data;
}

async function getDb() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(DEFAULT_DATA, null, 2));
  }
  
  const content = fs.readFileSync(DB_PATH, 'utf-8');
  let data;
  try {
    data = JSON.parse(content);
    data = migrate(data);
  } catch (e) {
    data = DEFAULT_DATA;
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  }

  return {
    prepare: (query) => {
      const q = query.toLowerCase();
      return {
        get: (param) => {
          if (q.includes('from users')) {
            // Support both username and ID lookup
            const user = data.users.find(u => u.username === param || u.id == param);
            return user || null;
          }
          if (q.includes('from projects')) {
            return data.projects.find(p => p.id == param) || null;
          }
          if (q.includes('count(*)')) {
             if (q.includes('projects')) {
                const count = q.includes('active') ? data.projects.filter(p => p.status === 'active').length : data.projects.length;
                return { count };
             }
          }
          return null;
        },
        all: (param) => {
          if (q.includes('from projects')) {
             let res = [...data.projects];
             if (q.includes('order by')) res.sort((a,b) => b.id - a.id);
             if (q.includes('limit')) res = res.slice(0, param || 5);
             return res;
          }
          if (q.includes('from roles')) return data.roles;
          if (q.includes('from users')) return data.users;
          return [];
        },
        run: (...params) => {
          if (q.includes('insert into users')) {
            const id = Date.now();
            data.users.push({ id, username: params[0], password_hash: params[1], role_id: params[2] });
          } else if (q.includes('insert into projects')) {
            const id = Date.now();
            data.projects.push({ 
              id, title_id: params[0], title_en: params[1], category: params[2], 
              desc_id: params[3], desc_en: params[4], image_url: params[5], 
              status: params[6], date_created: new Date().toISOString()
            });
          } else if (q.includes('update projects')) {
            const id = params[params.length - 1];
            const idx = data.projects.findIndex(p => p.id == id);
            if (idx !== -1) {
              data.projects[idx] = { 
                ...data.projects[idx], title_id: params[0], title_en: params[1],
                category: params[2], desc_id: params[3], desc_en: params[4],
                image_url: params[5], status: params[6] 
              };
            }
          } else if (q.includes('delete from projects')) {
            data.projects = data.projects.filter(p => p.id != params[0]);
          }
          fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
          return { lastInsertRowid: Date.now() };
        }
      };
    }
  };
}

async function initDb() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(DEFAULT_DATA, null, 2));
  }
}

module.exports = { getDb, initDb };
