-- Roles Table
CREATE TABLE IF NOT EXISTS roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    role_name TEXT NOT NULL UNIQUE
);

-- Users Table (RBAC)
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role_id INTEGER NOT NULL,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    category TEXT NOT NULL, -- Electrical, Networking, Cooling, Heating, Plumbing
    description_detail TEXT NOT NULL,
    image_url TEXT,
    status TEXT DEFAULT 'active', -- active, archived
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Initial Roles
INSERT OR IGNORE INTO roles (role_name) VALUES ('SuperAdmin'), ('Editor');
