# DarshanEase – Temple Darshan Ticket Booking Platform

DarshanEase is a full-stack web application designed to simplify temple visit management by allowing devotees to book darshan slots online. The platform enables users to register, browse temples, book time slots, and manage bookings while providing an administrative dashboard for managing temples, bookings, and system statistics.

This project demonstrates a complete **MERN-style architecture** with a React frontend, Node.js backend, and MongoDB database.

---

# Project Overview

Temple visits often involve long queues and manual booking systems. DarshanEase aims to digitize the process by providing an online booking platform that improves user convenience and temple management efficiency.

Users can:

* Register and login securely
* View temple details
* Book darshan slots
* Manage their bookings

Administrators can:

* Manage temples
* Monitor bookings
* View platform statistics

---

# Tech Stack

### Frontend

* React
* Vite
* React Router
* Axios
* CSS Modules

### Backend

* Node.js
* Express.js
* REST API Architecture

### Database

* MongoDB
* Mongoose ODM

### Authentication

* JSON Web Tokens (JWT)

### Development Tools

* Nodemon
* dotenv
* Morgan

---

# Project Structure

```
DarshanEase
│
├── client                # Frontend (React + Vite)
│   ├── src
│   │   ├── api
│   │   ├── components
│   │   ├── context
│   │   ├── hooks
│   │   ├── pages
│   │   └── utils
│   ├── index.html
│   └── package.json
│
├── server                # Backend (Node + Express)
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── seed.js
│   ├── index.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

# Key Features

### User Features

* User registration and authentication
* Secure login using JWT
* Browse temple information
* Book darshan slots
* View booking history

### Admin Features

* Admin dashboard
* Temple management
* Booking statistics
* User management

### System Features

* RESTful API architecture
* Role-based access control
* Error handling middleware
* Modular backend structure

---

# API Endpoints

### Authentication

```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Temples

```
GET  /api/temples
POST /api/admin/temples
PUT  /api/admin/temples/:id
DELETE /api/admin/temples/:id
```

### Bookings

```
POST /api/bookings
GET  /api/bookings
GET  /api/bookings/admin/stats
```

---

# Installation & Setup

### 1. Clone the Repository

```
git clone https://github.com/yourusername/darshan-ease.git
cd darshan-ease
```

---

### 2. Install Backend Dependencies

```
cd server
npm install
```

---

### 3. Install Frontend Dependencies

```
cd ../client
npm install
```

---

### 4. Configure Environment Variables

Create a `.env` file inside the **server folder**.

Example configuration:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/darshanEase
JWT_SECRET=your_secret_key
NODE_ENV=development
```

---

### 5. Run Backend Server

```
cd server
npm run dev
```

Backend will run at:

```
http://localhost:5000
```

---

### 6. Run Frontend

```
cd client
npm run dev
```

Frontend will run at:

```
http://localhost:5173
```

---

# Database

This project uses **MongoDB** with **Mongoose** for schema modeling and data management.

Example collections:

* users
* temples
* bookings
* slots

---

# Development Highlights

This project demonstrates:

* Modular backend architecture
* API-based client-server communication
* Authentication and authorization workflows
* Database schema design
* Frontend routing and state management

---

# Future Improvements

Possible enhancements include:

* Online payment integration
* Real-time slot availability updates
* Email confirmations for bookings
* Mobile responsive UI improvements
* Deployment to cloud platforms

---

# Team Members

1) Sahaj Jain ( Team Lead )
2) Sanjeev Raj
3) Somil Sahu
4) Ujjwal Chaubey

---

# License

This project is created for educational and portfolio purposes.

---
