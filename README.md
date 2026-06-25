# 🩺 Patient Diary

> Modern multi-language patient diary and medical event tracking system built with React, TypeScript, PHP and MySQL.

<p align="center">
  <img src="https://img.shields.io/badge/React-19-blue?logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" />
  <img src="https://img.shields.io/badge/PHP-8+-777bb4?logo=php" />
  <img src="https://img.shields.io/badge/MySQL-Database-orange?logo=mysql" />
  <img src="https://img.shields.io/badge/TailwindCSS-UI-38bdf8?logo=tailwindcss" />
  <img src="https://img.shields.io/badge/Vite-Build-purple?logo=vite" />
</p>

---

# ✨ Features

- Multi-user patient management
- Secure authentication system
- Vital parameter tracking
- Medical event logging
- Document / image / video uploads for events
- PDF, image and video preview
- Event-based document organization
- Multi-language interface
- Responsive dark-themed UI
- Modal-based workflow
- Custom measurement and event timestamps
- Patient-specific data isolation

---

# 🖥️ Tech Stack

## Frontend
- React
- TypeScript
- Vite
- TailwindCSS

## Backend
- PHP 8+
- MySQL / MariaDB
- PHP Sessions

---

# 🚀 Installation

## 1. Clone repository

```bash
git clone https://github.com/drandrew112/patient_diary.git
```

---

## 2. Database setup

Import:

```txt
patient_diany.sql
```

---

## 3. Backend configuration

Edit:

```txt
backend/mysql.php
```

Example:

```php
$host = "localhost";
$dbname = "patient_diary";
$user = "root";
$pass = "";
```

---

## 4. Frontend setup

```bash
cd frontend
npm install
```

---

## 5. Environment variables

Create:

```txt
frontend/.env
```

Example:

```env
VITE_API_URL=http://localhost/patient_diary/backend
```

---

# 🏗️ Production Build

```bash
npm run build
```

Build output:

```txt
frontend/dist/
```

---

# 🌍 Internationalization

Currently supported:
- 🇬🇧 English
- 🇭🇺 Hungarian
- 🇩🇪 German (AI-generated)
- 🇮🇹 Italian (AI-generated)

Structured translation system with automatic fallback support.

---

# 📂 File Upload Storage

Uploaded files are stored in:

```txt
backend/uploads/events/{event_id}/
```

Database example:

```json
[
  {
    "path": "uploads/events/15/lab.pdf",
    "name": "lab.pdf",
    "displayName": "Blood Test"
  }
]
```

---

# 🔒 Security Notes

Current implementation uses:

```php
md5()
```

---

# 📄 License

Educational / personal project.

---

# 👨‍💻 Repository

GitHub:
https://github.com/drandrew112/patient_diary
