# TaskFlow - Task Management System

A full-stack task management application built with Django REST Framework and React.

## 🚀 Tech Stack

**Backend:**
- Python 3.10+
- Django 5.2
- Django REST Framework
- PostgreSQL
- JWT Authentication

**Frontend:**
- React 19
- Tailwind CSS
- Axios
- React Router

## 📋 Features

- User Authentication (Signup/Login with JWT)
- Create, Read, Update, Delete Tasks
- Assign tasks to team members
- Filter & Search tasks by status, priority
- User Profile Management
- Team Member Dashboard
- Task Statistics & Analytics

## 🛠️ Quick Setup

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL 15
- Docker (for database)

### Run Application

**1. Start Database:**
```bash
docker-compose up -d
```

**2. Start Backend:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

**3. Start Frontend (new terminal):**
```bash
cd frontend
npm install
npm start
```

**Access:**
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- Admin: http://localhost:8000/admin

## 📝 Notes

- CORS enabled for localhost:3000
- PostgreSQL runs on port 5432