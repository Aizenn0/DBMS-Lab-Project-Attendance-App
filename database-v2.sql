-- database-v2.sql
-- Run this in your Neon SQL Editor to drop old tables and create new ones.
-- WARNING: This will delete existing Data. 

DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS classes CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS teachers CASCADE; -- old schema cleanup
DROP TABLE IF EXISTS audit_logs CASCADE;

-- 1. Users (Admin / Teachers)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL, -- Hashed with bcrypt
  role TEXT CHECK (role IN ('admin', 'teacher')) DEFAULT 'teacher',
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Classes
CREATE TABLE classes (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  teacher_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  term TEXT NOT NULL DEFAULT 'Full Year',
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Students
CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
  contact_email TEXT, -- For absence alerts
  created_at TIMESTAMP DEFAULT NOW()
);

-- 4. Attendance
CREATE TABLE attendance (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
  class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status TEXT CHECK (status IN ('present', 'absent', 'late', 'excused')) NOT NULL,
  notes TEXT,
  UNIQUE (student_id, date)
);

-- 5. Audit Logs
CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Default Admin User (Password is 'admin123' bcrypt hashed)
INSERT INTO users (name, email, password, role) 
VALUES ('Super Admin', 'admin@school.com', '$2y$10$tZ2x.2G28kYm/8.jB1N5bOmD/Sg0u6XzW7M7k2rB1M6z5E5q4E/Fq', 'admin');
