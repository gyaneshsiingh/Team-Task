TaskFlow - Team Task Management Application | RBAC | MERN Stack 2025

A powerful, modern team task management application built with React, Node.js, and MongoDB — featuring Role-Based Access Control, task assignment, and real-time collaboration.

Keywords: Team Task Management, RBAC, Todo List, Productivity App, React, MERN Stack, Project Management, Team Collaboration, Admin Dashboard, Task Assignment

Live Demo: https://taskflow-indol-six.vercel.app/
GitHub: https://github.com/gyaneshsiingh/taskflow

--------------------------------------------------------------------------------

What is TaskFlow?
TaskFlow is a free, open-source team task management application designed for teams and individuals who need structured collaboration with role-based access control. Built with the full MERN stack, TaskFlow lets Admins create and assign tasks to Members, while members get a focused view of only the work assigned to them.

Perfect for:
- Dev Teams managing sprints, bugs, and features across roles
- Project Managers assigning and tracking work across team members
- Students collaborating on group assignments
- Freelancers delegating tasks across sub-contractors
- Startups managing structured team workflows without expensive tools

--------------------------------------------------------------------------------

Features & Benefits

Core Task Management
- Smart Task Creation: Create tasks with title, description, priority, category, due date
- Task Assignment: Admins can assign any task to any registered team member
- Priority Management: Visual priority indicators (High, Medium, Low)
- Category Organization: Custom categories with color coding
- Due Date Tracking: Calendar integration with overdue highlighting
- Task Status Flow: todo -> in-progress -> done
- Task Archiving: Archive completed tasks without losing history
- Kanban & List Views: Switch between board and list layout

Team Collaboration
- Role-Based Signup: Users choose Admin or Member role at registration
- Admin Task Assignment: Admins assign tasks directly to any member
- Shared Task Visibility: Assigned tasks appear automatically in the member's dashboard
- Assignment Badges: Tasks show "Assigned to [name]" and "Assigned by [name]" indicators
- Member View-Only Mode: Members see tasks without create/edit/delete access

Security & Authentication
- JWT Authentication: Secure, stateless token-based auth with 7-day expiry
- Role-Aware Login: Login response includes user role, stored for UI rendering
- Protected API Routes: requireRole('admin') middleware guards admin-only endpoints
- Data Isolation: Users only see tasks they created or were assigned to them

Modern UI/UX
- Dark Theme: Eye-friendly dark interface with blue/purple accents
- Role Badges: Admin or Member badges shown in sidebar
- Responsive: Works on desktop, tablet, and mobile
- Smooth Animations: Polished transitions and micro-interactions
- Toast Notifications: Real-time feedback for all actions

--------------------------------------------------------------------------------

Role-Based Access Control

TaskFlow implements a two-tier RBAC system:

Admin
- Create tasks (Yes)
- Edit tasks (Yes)
- Delete tasks (Yes)
- Assign tasks to members (Yes)
- Add/edit/delete categories (Yes)
- View all assigned/created tasks (Yes)
- Fetch full user list (Yes)

Member
- View tasks assigned to them (Yes)
- Toggle task completion (Yes)
- Create tasks (No)
- Edit/Delete tasks (No)
- Assign tasks (No)
- Add/Delete categories (No)

> Members see a "View-only mode" notice in the sidebar and all write actions are hidden from the UI.

How Assignment Works:
1. Admin opens Add Task -> sees an Assign To dropdown listing all users
2. Selects a member -> task is created with assignedTo = member._id
3. Member logs in -> backend returns tasks where userId = me OR assignedTo = me
4. Task appears in member's dashboard with an "Assigned by [Admin Name]" badge.

--------------------------------------------------------------------------------

Quick Start Guide

Prerequisites
- Node.js v16+ (https://nodejs.org/)
- npm or yarn
- MongoDB (local or MongoDB Atlas)
- Git

Installation
1. Clone the Repository
   git clone https://github.com/gyaneshsiingh/taskflow.git
   cd taskflow

2. Install Dependencies
   # Install client dependencies
   cd client && npm install

   # Install server dependencies
   cd ../server && npm install
   cd ..

3. Environment Setup

   Client (client/.env)
   VITE_API_URL=http://localhost:3000/api
   VITE_APP_NAME=TaskFlow

   Server (server/.env)
   NODE_ENV=development
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/taskflow
   JWT_SECRET=your-super-secret-jwt-key-min-32-characters
   JWT_EXPIRES_IN=7d
   BCRYPT_SALT_ROUNDS=12
   CLIENT_URL=http://localhost:5173

4. Start Development Servers
   npm run dev

5. Access the App
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000/api

--------------------------------------------------------------------------------

Technology Stack

Frontend:
- React 18, Vite, Tailwind CSS, Lucide React, Radix UI / shadcn, React Router v6, Axios

Backend:
- Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs, CORS

Deployment:
- Vercel (Frontend), Render / Railway (Backend), MongoDB Atlas (Database)

--------------------------------------------------------------------------------

Contributing
Contributions are welcome! Please fork the repository, create a feature branch, commit your changes, push to the branch, and open a Pull Request.

License
This project is licensed under the MIT License.

--------------------------------------------------------------------------------

About the Developer
Gyanesh Singh - Full Stack Developer
GitHub: https://github.com/gyaneshsiingh
LinkedIn: https://linkedin.com/in/gyaneshsingh
Email: gyaneshsingh@gmail.com
