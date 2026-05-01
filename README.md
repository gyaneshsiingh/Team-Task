# TaskFlow - Team Task Management Application | RBAC | MERN Stack 2025

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

## What is TaskFlow?

TaskFlow is a **free, open-source team task management application** designed for teams and individuals who need structured collaboration with role-based access control. Built with the full MERN stack, TaskFlow lets **Admins** create and assign tasks to **Members**, while members get a focused view of only the work assigned to them.

### Perfect for:
- **Dev Teams** managing sprints, bugs, and features across roles
- **Project Managers** assigning and tracking work across team members
- **Students** collaborating on group assignments
- **Freelancers** delegating tasks across sub-contractors
- **Startups** managing structured team workflows without expensive tools

---

## Table of Contents

- [What is TaskFlow?](#what-is-taskflow)
- [Features & Benefits](#features--benefits)
- [Role-Based Access Control](#role-based-access-control)
- [Quick Start Guide](#quick-start-guide)
- [Live Demo](#live-demo)
- [Technology Stack](#technology-stack)
- [Project Architecture](#project-architecture)
- [Screenshots](#screenshots)
- [Configuration](#configuration)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [License](#license)
- [About the Developer](#about-the-developer)

---

## Features & Benefits

### Core Task Management
- **Smart Task Creation** — Create tasks with title, description, priority, category, due date
- **Task Assignment** — Admins can assign any task to any registered team member
- **Priority Management** — Visual priority indicators (High, Medium, Low)
- **Category Organization** — Custom categories with color coding
- **Due Date Tracking** — Calendar integration with overdue highlighting
- **Task Status Flow** — `todo` -> `in-progress` -> `done`
- **Task Archiving** — Archive completed tasks without losing history
- **Kanban & List Views** — Switch between board and list layout

### Team Collaboration
- **Role-Based Signup** — Users choose Admin or Member role at registration
- **Admin Task Assignment** — Admins assign tasks directly to any member
- **Shared Task Visibility** — Assigned tasks appear automatically in the member's dashboard
- **Assignment Badges** — Tasks show "Assigned to [name]" and "Assigned by [name]" indicators
- **Member View-Only Mode** — Members see tasks without create/edit/delete access

### Security & Authentication
- **JWT Authentication** — Secure, stateless token-based auth with 7-day expiry
- **Role-Aware Login** — Login response includes user role, stored for UI rendering
- **Protected API Routes** — `requireRole('admin')` middleware guards admin-only endpoints
- **Data Isolation** — Users only see tasks they created or were assigned to them

### Modern UI/UX
- **Dark Theme** — Eye-friendly dark interface with blue/purple accents
- **Role Badges** — Admin or Member badges shown in sidebar
- **Responsive** — Works on desktop, tablet, and mobile
- **Smooth Animations** — Polished transitions and micro-interactions
- **Toast Notifications** — Real-time feedback for all actions

---

## Role-Based Access Control

TaskFlow implements a two-tier RBAC system:

### Admin
| Capability | Status |
|---|---|
| Create tasks | ✅ |
| Edit tasks | ✅ |
| Delete tasks | ✅ |
| Assign tasks to members | ✅ |
| Add/edit/delete categories | ✅ |
| View all assigned/created tasks | ✅ |
| Fetch full user list | ✅ |

### Member
| Capability | Status |
|---|---|
| View tasks assigned to them | ✅ |
| Toggle task completion | ✅ |
| Create tasks | ❌ |
| Edit/Delete tasks | ❌ |
| Assign tasks | ❌ |
| Add/Delete categories | ❌ |

> Members see a "View-only mode" notice in the sidebar and all write actions are hidden from the UI.

### How Assignment Works
1. Admin opens **Add Task** -> sees an **Assign To** dropdown listing all users
2. Selects a member -> task is created with `assignedTo = member._id`
3. Member logs in -> backend returns tasks where `userId = me OR assignedTo = me`
4. Task appears in member's dashboard with an "Assigned by [Admin Name]" badge.

---

