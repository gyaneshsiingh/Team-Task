# 🚀 TaskFlow - Team Task Management Application | RBAC | MERN Stack 2025

<div align="center">
  
![TaskFlow - Team Task Management](screenshots/home.png)

**A powerful, modern team task management application built with React, Node.js, and MongoDB — featuring Role-Based Access Control, task assignment, and real-time collaboration.**

**Keywords:** Team Task Management, RBAC, Todo List, Productivity App, React, MERN Stack, Project Management, Team Collaboration, Admin Dashboard, Task Assignment

[![Live Demo](https://img.shields.io/badge/Live-Demo-blue?style=for-the-badge&logo=vercel)](https://taskflow-indol-six.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/gyaneshsiingh/taskflow)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?style=for-the-badge&logo=mongodb)](https://mongodb.com/)

</div>

---

## 🎯 What is TaskFlow?

TaskFlow is a **free, open-source team task management application** designed for teams and individuals who need structured collaboration with role-based access control. Built with the full MERN stack, TaskFlow lets **Admins** create and assign tasks to **Members**, while members get a focused view of only the work assigned to them.

### 🔍 Perfect for:
- **Dev Teams** managing sprints, bugs, and features across roles
- **Project Managers** assigning and tracking work across team members
- **Students** collaborating on group assignments
- **Freelancers** delegating tasks across sub-contractors
- **Startups** managing structured team workflows without expensive tools

---

## 📋 Table of Contents

- [🎯 What is TaskFlow?](#-what-is-taskflow)
- [✨ Features & Benefits](#-features--benefits)
- [🔐 Role-Based Access Control](#-role-based-access-control)
- [🚀 Quick Start Guide](#-quick-start-guide)
- [🎯 Live Demo](#-live-demo)
- [🛠️ Technology Stack](#️-technology-stack)
- [📁 Project Architecture](#-project-architecture)
- [🎨 Screenshots](#-screenshots)
- [🔧 Configuration](#-configuration)
- [📱 API Reference](#-api-reference)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [👨‍💻 About the Developer](#-about-the-developer)

---

## ✨ Features & Benefits

### 🎯 Core Task Management
- **Smart Task Creation** — Create tasks with title, description, priority, category, due date
- **Task Assignment** — Admins can assign any task to any registered team member
- **Priority Management** — Visual priority indicators: High 🔴, Medium 🟡, Low 🟢
- **Category Organization** — Custom categories with color coding
- **Due Date Tracking** — Calendar integration with overdue highlighting
- **Task Status Flow** — `todo` → `in-progress` → `done`
- **Task Archiving** — Archive completed tasks without losing history
- **Kanban & List Views** — Switch between board and list layout

### 👥 Team Collaboration
- **Role-Based Signup** — Users choose Admin or Member role at registration
- **Admin Task Assignment** — Admins assign tasks directly to any member
- **Shared Task Visibility** — Assigned tasks appear automatically in the member's dashboard
- **Assignment Badges** — Tasks show "Assigned to [name]" and "Assigned by [name]" indicators
- **Member View-Only Mode** — Members see tasks without create/edit/delete access

### 🔒 Security & Authentication
- **JWT Authentication** — Secure, stateless token-based auth with 7-day expiry
- **Role-Aware Login** — Login response includes user role, stored for UI rendering
- **Protected API Routes** — `requireRole('admin')` middleware guards admin-only endpoints
- **Data Isolation** — Users only see tasks they created or were assigned to them

### 🎨 Modern UI/UX
- **Dark Theme** — Eye-friendly dark interface with blue/purple accents
- **Role Badges** — 🟣 Admin (shield icon) / 🔵 Member (user icon) shown in sidebar
- **Responsive** — Works on desktop, tablet, and mobile
- **Smooth Animations** — Polished transitions and micro-interactions
- **Toast Notifications** — Real-time feedback for all actions

---

## 🔐 Role-Based Access Control

TaskFlow implements a **two-tier RBAC system**:

### 👑 Admin
| Capability | Status |
|---|---|
| Create tasks | ✅ |
| Edit tasks | ✅ |
| Delete tasks | ✅ |
| Assign tasks to members | ✅ |
| Add/edit/delete categories | ✅ |
| View all assigned/created tasks | ✅ |
| Fetch full user list | ✅ |

### 👤 Member
| Capability | Status |
|---|---|
| View tasks assigned to them | ✅ |
| Toggle task completion | ✅ |
| Create tasks | ❌ |
| Edit/Delete tasks | ❌ |
| Assign tasks | ❌ |
| Add/Delete categories | ❌ |

> Members see a **"👁️ View-only mode"** notice in the sidebar and all write actions are hidden from the UI.

### How Assignment Works
1. Admin opens **Add Task** → sees a purple **"🎯 Assign To"** dropdown listing all users
2. Selects a member → task is created with `assignedTo = member._id`
3. Member logs in → backend returns tasks where `userId = me OR assignedTo = me`
4. Task appears in member's dashboard with **"Assigned by [Admin Name]"** badge ✅

---

## 🚀 Quick Start Guide

### ⚡ Prerequisites
- **Node.js** v16+ — [Download](https://nodejs.org/)
- **npm** or **yarn**
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **Git**

### 📦 Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/gyaneshsiingh/taskflow.git
cd taskflow
```

#### 2. Install Dependencies
```bash
# Install client dependencies
cd client && npm install

# Install server dependencies
cd ../server && npm install
cd ..
```

#### 3. Environment Setup

**📁 Client (`client/.env`)**
```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=TaskFlow
```

**📁 Server (`server/.env`)**
```env
NODE_ENV=development
PORT=3000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/taskflow
# Or Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskflow

# Auth
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=12

# CORS
CLIENT_URL=http://localhost:5173
```

#### 4. Start Development Servers
```bash
# Both client + server (recommended)
npm run dev

# Or separately:
cd server && npm run dev    # Terminal 1
cd client && npm run dev    # Terminal 2
```

#### 5. Access the App
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api

### 🎯 First Steps
1. **Register as Admin** — Pick "Admin" role on signup
2. **Register team members** — Have teammates sign up as "Member"
3. **Create a task** — Fill in title, description, priority, category
4. **Assign it** — Use the "🎯 Assign To" dropdown to assign to a member
5. **Member logs in** — They'll see the assigned task in their dashboard ✅

---

## 🎯 Live Demo

🌐 **Try TaskFlow**: [https://taskflow-indol-six.vercel.app](https://taskflow-indol-six.vercel.app)

### 🎮 Demo Accounts
```
👑 Admin Account:
📧 Email: admin@demo.com
🔑 Password: demo1234

👤 Member Account:
📧 Email: member@demo.com  
🔑 Password: demo1234
```

---

## 🛠️ Technology Stack

### 🎨 Frontend
| Technology | Purpose |
|---|---|
| **React 18** | Component-based UI with hooks |
| **Vite** | Fast dev server and build tool |
| **Tailwind CSS** | Utility-first styling |
| **Lucide React** | Icon library |
| **Radix UI / shadcn** | Accessible UI primitives |
| **React Router v6** | Client-side routing |
| **Axios** | HTTP client for API calls |

### ⚙️ Backend
| Technology | Purpose |
|---|---|
| **Node.js** | JavaScript runtime |
| **Express.js** | REST API framework |
| **MongoDB** | NoSQL document database |
| **Mongoose** | MongoDB ODM |
| **JWT** | Stateless authentication |
| **bcryptjs** | Password hashing |
| **CORS** | Cross-origin request handling |

### 🚀 Deployment
| Service | Purpose |
|---|---|
| **Vercel** | Frontend hosting |
| **Render / Railway** | Backend hosting |
| **MongoDB Atlas** | Cloud database |

---

## 📁 Project Architecture

```
taskflow/
├── 📁 client/                        # React Frontend
│   └── 📁 src/
│       ├── 📁 components/
│       │   ├── 📁 landing/           # Landing page sections
│       │   │   ├── hero-section.jsx
│       │   │   └── features-section.jsx
│       │   ├── 📁 layout/            # Navbar, Footer
│       │   ├── 📁 ui/                # shadcn/ui components
│       │   ├── login-form.jsx        # Login (saves role to localStorage)
│       │   └── signup-form.jsx       # Signup with Admin/Member selector
│       ├── 📁 pages/
│       │   ├── dashboard.jsx         # Main dashboard (RBAC-aware)
│       │   ├── landing-page.jsx
│       │   ├── login-page.jsx
│       │   └── signup-page.jsx
│       └── 📁 lib/
│           ├── api.js                # Axios instance
│           └── utils.js
│
├── 📁 server/
│   └── 📁 src/
│       ├── 📁 controllers/
│       │   ├── authControllers.js    # register, login, getProfile, getAllUsers
│       │   ├── todoController.js     # CRUD + assignment-aware filtering
│       │   ├── categoryController.js
│       │   └── projectController.js
│       ├── 📁 middleware/
│       │   └── auth.js               # protect + requireRole() middleware
│       ├── 📁 models/
│       │   ├── user.models.js        # User schema with role field
│       │   ├── todo.models.js        # Todo schema with assignedTo field
│       │   ├── project.models.js     # Project with member roles
│       │   └── category.models.js
│       ├── 📁 routes/
│       │   ├── auth.js               # Auth + GET /users (admin only)
│       │   ├── todos.js
│       │   ├── categories.js
│       │   └── projects.js
│       └── app.js
└── README.md
```

### 🏗️ Architecture Highlights
- **RBAC via Middleware** — `requireRole('admin')` guards sensitive routes
- **Assignment-Aware Queries** — MongoDB `$and`/`$or` ensures members see assigned tasks
- **Role in JWT payload** — Decoded on every request, no extra DB lookup needed
- **localStorage Role Cache** — UI reads `userRole` from localStorage for instant rendering

---

## 🎨 Screenshots

### 🏠 Landing Page
![Landing Page](screenshots/home.png)
*Full-width hero with feature highlights*

### 📊 Admin Dashboard
![Dashboard](screenshots/features.png)
*Admin sees Add Task, Edit, Delete, and the Assign To dropdown*

### 🔐 Signup with Role Selection
![Sign In](screenshots/signin.png)
*Role selector: Admin (🟣 shield) or Member (🔵 user)*

### 💻 MacBook Demo
![MacBook UI](screenshots/macui.png)
*Interactive MacBook scroll component*

---

## 🔧 Configuration

### Database Setup

**Local MongoDB:**
```bash
# macOS
brew install mongodb/brew/mongodb-community
brew services start mongodb/brew/mongodb-community

# Ubuntu
sudo apt-get install -y mongodb
sudo systemctl start mongodb
```

**MongoDB Atlas:**
1. Create account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Whitelist your IP
4. Copy connection string → paste into `server/.env`

### Environment Variables Reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `MONGODB_URI` | ✅ | — | MongoDB connection string |
| `JWT_SECRET` | ✅ | — | Secret key (min 32 chars) |
| `CLIENT_URL` | ✅ | — | Frontend URL for CORS |
| `PORT` | ❌ | 3000 | Server port |
| `NODE_ENV` | ❌ | development | Environment mode |
| `JWT_EXPIRES_IN` | ❌ | 7d | Token expiry duration |
| `BCRYPT_SALT_ROUNDS` | ❌ | 12 | Password hashing rounds |

---

## 📱 API Reference

### Authentication Endpoints

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "admin"           // "admin" | "member" (default: "member")
}
```

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

// Response includes: { user: { id, name, email, role }, token }
```

```http
GET /api/auth/profile
Authorization: Bearer <token>
```

```http
GET /api/auth/users
Authorization: Bearer <token>       // Admin only
// Returns all users for task assignment dropdown
```

### Task Endpoints

```http
GET /api/todos
Authorization: Bearer <token>
// Returns tasks created by user OR assigned to user

POST /api/todos
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Design homepage",
  "description": "Create wireframes and mockups for the new homepage",
  "priority": "high",
  "category": "design",
  "dueDate": "2025-06-01",
  "assignedTo": "<userId>"    // Optional: assign to a member (admin only)
}

PUT /api/todos/:id
Authorization: Bearer <token>

PATCH /api/todos/:id/toggle
Authorization: Bearer <token>
// Toggle complete — available to task owner OR assignee

DELETE /api/todos/:id
Authorization: Bearer <token>       // Admin / task owner only
```

### Category Endpoints

```http
GET /api/categories
Authorization: Bearer <token>

POST /api/categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Design",
  "color": "#3b82f6"
}

PUT /api/categories/:id
Authorization: Bearer <token>

DELETE /api/categories/:id
Authorization: Bearer <token>
```

### Middleware Usage

```js
import { protect, requireRole } from '../middleware/auth.js';

// Authenticated routes
router.get('/profile', protect, getProfile);

// Admin-only routes
router.get('/users', protect, requireRole('admin'), getAllUsers);
router.delete('/tasks/:id', protect, requireRole('admin'), deleteTask);
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'feat: add your feature description'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open a Pull Request**

### Development Guidelines
- Follow existing code style and naming conventions
- Write meaningful, descriptive commit messages
- Add comments for complex business logic
- Test all role scenarios (admin & member) before submitting
- Update this README if you add new features or API endpoints

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 About the Developer

<div align="center">

### Gyanesh Singh
*Full Stack Developer*

[![GitHub](https://img.shields.io/badge/GitHub-gyaneshsiingh-black?style=for-the-badge&logo=github)](https://github.com/gyaneshsiingh)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-gyaneshsingh-blue?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/gyaneshsingh)
[![Email](https://img.shields.io/badge/Email-gyaneshsingh@gmail.com-red?style=for-the-badge&logo=gmail)](mailto:gyaneshsingh@gmail.com)

</div>

Passionate full-stack developer specializing in:
- **Frontend**: React.js, Tailwind CSS, Modern UI/UX Design
- **Backend**: Node.js, Express.js, MongoDB, RESTful APIs
- **Architecture**: RBAC systems, JWT auth, real-time collaboration

---

<div align="center">

**⭐ If you found this project helpful, please give it a star! ⭐**

**🚀 [Visit TaskFlow Live](https://taskflow-indol-six.vercel.app) | 🐛 [Report Bug](https://github.com/gyaneshsiingh/taskflow/issues) | 💡 [Request Feature](https://github.com/gyaneshsiingh/taskflow/issues)**

Made with ❤️ by [Gyanesh Singh](https://github.com/gyaneshsiingh)

</div>