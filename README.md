<div align="center">
  <img src="https://img.shields.io/badge/M.K.D.-College_ERP-indigo?style=for-the-badge&logo=react&logoColor=white" alt="ERP Logo" />
  <h1>🎓 College ERP Management System</h1>
  <p>An enterprise-grade, full-stack MERN ERP solution engineered for seamless admissions, robust fee collection, and real-time institutional analytics.</p>

  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  </p>
  <p>
    <img src="https://img.shields.io/badge/Status-Production_Ready-success?style=flat-square" alt="Status" />
    <img src="https://img.shields.io/badge/License-Proprietary-red?style=flat-square" alt="License" />
    <img src="https://img.shields.io/badge/Docker-Supported-blue?style=flat-square" alt="Docker" />
  </p>
</div>

<br />

## 🌟 Overview

The College ERP System is a comprehensive platform meticulously designed to streamline complex administrative workflows for modern educational institutions. It replaces paper-based methods and disjointed spreadsheets with a unified, high-performance web application.

---

## ✨ Core Features & Modules

Below is the modular breakdown of the ERP system, designed to handle thousands of records securely and efficiently.

### 📈 Institutional Analytics
![Analytics](https://img.shields.io/badge/Module-Analytics_Dashboard-2563eb?style=flat-square)  
Live tracking of key performance indicators (KPIs). Beautiful **Recharts** integrations visualize total admissions over time, revenue splits (Admission, Tuition, Exam fees), and quick lists of recent transactions.

### 👩‍🎓 Student & Admission Management
![Admissions](https://img.shields.io/badge/Module-Admissions-16a34a?style=flat-square)  
Complete 360-degree student lifecycle tracking. From initial enrollment and assigning unique Admission Numbers to storing complex data (Aadhaar, category, permanent vs. correspondence addresses). Includes a powerful global **Student Profile Search**.

### 💰 Dynamic Fee Engine
![Fees](https://img.shields.io/badge/Module-Fee_Management-d97706?style=flat-square)  
Build highly customizable fee structures for various courses (e.g., B.Ed, D.El.Ed) and sessions. Includes dynamic installment tracking, granular fee breakdowns, and real-time pending balance calculations.

### 🧾 Collection & Ledger
![Collection](https://img.shields.io/badge/Module-Ledger_&_Receipts-0d9488?style=flat-square)  
Process walk-in or digital payments. Automatically generates sequential, uniquely numbered receipts (customizable prefix). Admins can view individual student ledgers and print professional invoice receipts instantly.

### ⚠️ Defaulter Tracking
![Defaulters](https://img.shields.io/badge/Module-Defaulter_Tracking-dc2626?style=flat-square)  
Automated mathematical pipelines instantly aggregate and identify students with outstanding dues against their assigned fee structures, making fee recovery follow-ups effortless.

### 📄 Advanced Reporting
![Reports](https://img.shields.io/badge/Module-Exports_&_Reports-7c3aed?style=flat-square)  
Generate and export data-driven insights. Built-in **jsPDF** and **SheetJS (xlsx)** integration allows administrators to export Admission Lists, Revenue Reports, and Defaulter logs directly to PDF or Excel with a single click.

### 🔐 Security & User Roles (RBAC)
![Security](https://img.shields.io/badge/Module-RBAC_Security-475569?style=flat-square)  
Enterprise-grade security using **JWT Authentication** and **Bcrypt** hashing. Granular access control supports roles such as `Super Admin`, `Principal`, `Admission Staff`, and `Accounts Staff`—each strictly restricted to their required modules.

### ⚙️ System Settings
![Settings](https://img.shields.io/badge/Module-Global_Settings-0f172a?style=flat-square)  
Easily customize the ERP without touching code. Modify receipt prefixes, add new academic courses, update active sessions, and execute one-click **JSON Database Backups** securely from the dashboard.

---

## 🛠️ Detailed Technology Stack

### Frontend Architecture
The client interface is built for speed, accessibility, and modern aesthetics (Glassmorphism).

- <img src="https://img.shields.io/badge/React_18-20232A?style=flat-square&logo=react&logoColor=61DAFB" /> : UI Library
- <img src="https://img.shields.io/badge/Vite-B73BFE?style=flat-square&logo=vite&logoColor=FFD62E" /> : Build Tool & Bundler
- <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" /> : Utility-first CSS Framework
- <img src="https://img.shields.io/badge/Shadcn/UI-000000?style=flat-square&logo=shadcnui&logoColor=white" /> : Accessible Component System
- <img src="https://img.shields.io/badge/React_Query-FF4154?style=flat-square&logo=reactquery&logoColor=white" /> : Server State Management & Caching
- <img src="https://img.shields.io/badge/Recharts-22b3db?style=flat-square" /> : Composable Data Visualization
- <img src="https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=axios&logoColor=white" /> : HTTP Client
- <img src="https://img.shields.io/badge/jsPDF_&_XLSX-FF9900?style=flat-square" /> : Client-side Document Generation

### Backend Architecture
A highly scalable RESTful API built to process thousands of queries securely.

- <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white" /> : JavaScript Runtime
- <img src="https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white" /> : Web Application Framework
- <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=flat-square&logo=mongodb&logoColor=white" /> : NoSQL Database
- <img src="https://img.shields.io/badge/Mongoose-880000?style=flat-square&logo=mongoose&logoColor=white" /> : Elegant Object Modeling
- <img src="https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white" /> : Stateless Authentication
- <img src="https://img.shields.io/badge/Bcrypt.js-F9DC3E?style=flat-square" /> : Password Hashing
- <img src="https://img.shields.io/badge/Zod-3068B7?style=flat-square" /> : Schema Validation

### DevOps & Deployment
- <img src="https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white" /> : Containerization
- <img src="https://img.shields.io/badge/Docker_Compose-2496ED?style=flat-square&logo=docker&logoColor=white" /> : Multi-container Orchestration
- <img src="https://img.shields.io/badge/NGINX-009639?style=flat-square&logo=nginx&logoColor=white" /> : High-performance Web Server / Reverse Proxy

---

## 🚀 Getting Started

### Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd college-erp
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/college_erp
   JWT_SECRET=your_super_secret_key
   ```
   Start the backend server:
   ```bash
   npm run dev
   ```

3. **Frontend Setup:**
   Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   npm install
   ```
   Create a `.env` file in the `frontend` directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
   Start the development server:
   ```bash
   npm run dev
   ```

4. **Access the application:**
   - **Frontend UI**: Open your browser and navigate to `http://localhost:5173`.
   - **Backend API**: The server listens on `http://localhost:5000`.

---

## 🐳 Docker Deployment

The application is fully containerized for zero-friction production deployment.

1. Ensure the `backend/.env` file is populated with your MongoDB connection string.
2. In the root directory, build and run the containers in detached mode:
   ```bash
   docker-compose up --build -d
   ```
3. The application will boot up automatically:
   - **Frontend UI**: `http://localhost:80`
   - **Backend API**: `http://localhost:5000`

---

## 👨‍💻 About the Creator

Developed and architected by **Priyanshu Singh**. 

This system was built with a deep focus on solving real-world administrative challenges in educational institutes, emphasizing high-performance, responsive design, and enterprise-grade security.

- **GitHub**: [@PriyanshuSingh10114](https://github.com/PriyanshuSingh10114)
- **Project**: MKD-CampusConnect

---

## 📜 License
This project is proprietary and intended exclusively for institutional use by M.K.D. Group of Education. Unauthorized copying, distribution, or modification is strictly prohibited.
