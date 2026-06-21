<div align="center">

# 🔧 DevFix AI

### *Intelligent Developer Environment & Error Resolution Platform*

[![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.1-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Gemini AI](https://img.shields.io/badge/AI-Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)

<br/>

> **Stop wasting hours on broken dev environments.**
> DevFix AI gives developers instant, structured fixes for environment errors — powered by a curated knowledge base, OCR screenshot analysis, and Google Gemini AI.

<br/>

[🚀 Features](#-features) · [🏗️ Tech Stack](#%EF%B8%8F-tech-stack) · [📡 API Reference](#-api-reference) · [⚙️ Run Locally](#%EF%B8%8F-run-locally) · [🗺️ Roadmap](#%EF%B8%8F-roadmap)

</div>

---

## 🎯 The Problem

Every student and junior developer has wasted hours on errors like these:

```
❌ 'java' is not recognized as an internal or external command
❌ Maven not found in PATH
❌ Port 8080 already in use
❌ Cannot connect to the Docker daemon
❌ npm ERR! Cannot find module
❌ JAVA_HOME is not set correctly
```

Google gives you 10 different Stack Overflow threads from 2013. DevFix AI gives you **one structured answer**, tailored to your OS, severity level, and tech stack.

---

## ✨ Features

### 🔍 Error Knowledge Base
Search 26+ real developer errors by keyword, technology, or severity. Every error includes a root cause, step-by-step fix, and OS-specific notes.

### 🤖 AI Troubleshooter *(Gemini-powered)*
Paste any error message and get an intelligent, context-aware diagnosis with actionable fix steps — powered by Google Gemini.

### 📸 Screenshot Analyzer *(Tesseract.js OCR)*
Upload a screenshot of your terminal or IDE. The OCR engine extracts the error text and automatically routes it to the AI for analysis.

### 📋 Error Log Analyzer
Paste raw log output. The analyzer identifies the critical failure point and suggests targeted fixes.

### 🩺 System Readiness Scanner
A guided, browser-based environment health checker that scans your dev stack (Java, Node, Maven, Git, Docker) and gives you a readiness score.

### 🗺️ Developer Setup Roadmaps
Visual, interactive setup guides for Java, Spring Boot, and React development — with progress tracking per user.

### 📦 Installation Guides
Step-by-step installation walkthroughs for every tool in the stack, organized by OS.

### 👤 Developer Profile
Set your stack (Java / Spring Boot / React / Full Stack) and get a personalized dashboard with relevant errors, guides, and roadmap progress.

### 🔐 JWT Authentication
Secure register + login flow. Protected endpoints for write operations. Progress and profile data tied to your account.

---

## 📊 Feature Status

| Feature | Status |
|---|:---:|
| 🔍 Full-text error search | ✅ Live |
| 🔴 Severity filtering (CRITICAL / HIGH / MEDIUM / LOW) | ✅ Live |
| 🐛 26+ errors in knowledge base | ✅ Live |
| 📋 Step-by-step installation guides | ✅ Live |
| 🗺️ Developer setup roadmaps + progress tracking | ✅ Live |
| 👤 Developer profile (Java / Spring Boot / React / Full Stack) | ✅ Live |
| 🔐 JWT Authentication (register + login) | ✅ Live |
| 📊 User dashboard | ✅ Live |
| 📸 Screenshot Analyzer (Tesseract.js OCR) | ✅ Live |
| 📋 Error Log Analyzer | ✅ Live |
| 🤖 AI Troubleshooter (Google Gemini) | ✅ Live |
| 🩺 System Readiness Scanner | ✅ Live |

---

## 🏗️ Tech Stack

### Backend
| Technology | Version | Role |
|---|---|---|
| Java | 21 | Language |
| Spring Boot | 4.1 | Web framework |
| Spring Security | — | Auth & CORS |
| Spring Data JPA | — | ORM layer |
| Hibernate | 7.4 | JPA implementation |
| PostgreSQL | 17 | Primary database |
| JJWT | 0.12.6 | JWT auth tokens |
| BCrypt | — | Password hashing |
| Lombok | — | Boilerplate reduction |
| Maven | 3.9+ | Build tool |

### Frontend
| Technology | Version | Role |
|---|---|---|
| React | 19 | UI framework |
| TypeScript | 5 / 6 | Type safety |
| Vite | 8 | Build tool & dev server |
| React Router | 7 | Client-side routing |
| Axios | 1.18 | HTTP client |
| Tesseract.js | 7 | OCR engine |
| Google Generative AI | 0.24 | Gemini AI SDK |
| Vanilla CSS | — | Styling |

---

## 📁 Project Structure

```
devfix-ai/
│
├── backend/devfix-ai/
│   └── src/main/java/com/devfix/
│       ├── auth/              # Register, Login, JWT DTOs & controllers
│       ├── config/            # CORS + Spring Security config
│       ├── controller/        # REST endpoint controllers
│       ├── entity/            # JPA entities (Technology, TechError, User)
│       ├── exception/         # GlobalExceptionHandler
│       ├── repository/        # JPA repos + JPQL full-text search
│       ├── security/          # JwtUtil + JwtAuthenticationFilter
│       └── service/           # Business logic layer
│
├── frontend/src/
│   ├── api/                   # Axios config + AuthContext
│   ├── components/            # Navbar, ErrorCard
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── SearchErrors.tsx
│   │   ├── ErrorDetail.tsx
│   │   ├── Technologies.tsx
│   │   ├── InstallGuide.tsx
│   │   ├── Roadmap.tsx
│   │   ├── DeveloperProfile.tsx
│   │   ├── Dashboard.tsx
│   │   ├── ScreenshotAnalyzer.tsx  # OCR-powered
│   │   ├── ErrorLogAnalyzer.tsx
│   │   ├── AITroubleshooter.tsx    # Gemini AI
│   │   ├── ReadinessChecker.tsx
│   │   ├── SystemScanner.tsx
│   │   ├── Login.tsx
│   │   └── Register.tsx
│   └── types/                 # TypeScript interfaces
│
├── docs/
│   ├── database-design.md
│   ├── requirements.md
│   └── user-flow.md
│
├── database/                  # SQL seed scripts
└── DevFix_AI.postman_collection.json
```

---

## 📡 API Reference

> Base URL: `http://localhost:8082`

### 🔑 Authentication
| Method | Endpoint | Auth Required | Description |
|---|---|:---:|---|
| `POST` | `/auth/register` | ❌ | Create account → returns JWT |
| `POST` | `/auth/login` | ❌ | Login → returns JWT |
| `GET` | `/auth/me` | ✅ | Verify token + get user info |

### ⚙️ Technologies
| Method | Endpoint | Auth Required | Description |
|---|---|:---:|---|
| `GET` | `/technologies` | ❌ | Get all technologies |
| `GET` | `/technologies/:id` | ❌ | Get one with its errors |
| `POST` | `/technologies` | ✅ | Create technology |
| `PUT` | `/technologies/:id` | ✅ | Update technology |
| `DELETE` | `/technologies/:id` | ✅ | Delete technology |

### 🐛 Errors (Knowledge Base)
| Method | Endpoint | Auth Required | Description |
|---|---|:---:|---|
| `GET` | `/errors` | ❌ | Get all errors |
| `GET` | `/errors/search?q={query}` | ❌ | Full-text search |
| `GET` | `/errors/severity/{level}` | ❌ | Filter by severity level |
| `GET` | `/errors/technology/{id}` | ❌ | Filter by technology |
| `POST` | `/errors` | ✅ | Add error to knowledge base |
| `PUT` | `/errors/:id` | ✅ | Update error |
| `DELETE` | `/errors/:id` | ✅ | Delete error |

> 📮 A full Postman collection is available at the root: `DevFix_AI.postman_collection.json`

---

## ⚙️ Run Locally

### Prerequisites
- Java 21+
- Maven 3.9+
- Node.js 22+
- PostgreSQL 17+

### 1. Clone the repository
```bash
git clone https://github.com/Sakshu4/devfix-ai.git
cd devfix-ai
```

### 2. Set up the database
```sql
CREATE DATABASE devfix_ai;
```

### 3. Configure the backend
Edit `backend/devfix-ai/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/devfix_ai
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD
```

### 4. Configure the frontend environment
Create `frontend/.env`:
```env
VITE_GEMINI_API_KEY=your_google_gemini_api_key
```
> Get a free Gemini API key at [aistudio.google.com](https://aistudio.google.com)

### 5. Start the backend
```bash
cd backend/devfix-ai
./mvnw spring-boot:run
# API running at http://localhost:8082
```

### 6. Start the frontend
```bash
cd frontend
npm install
npm run dev
# App running at http://localhost:5173
```

---

## 🗺️ Roadmap

| Phase | What's Built | Status |
|---|---|:---:|
| **Week 1** | Spring Boot backend + PostgreSQL + CRUD API | ✅ Done |
| **Week 2** | Error knowledge base + search + React frontend | ✅ Done |
| **Week 3** | JWT auth + Developer Profile + Roadmaps | ✅ Done |
| **Week 4** | System Readiness Scanner + Environment Checker | ✅ Done |
| **Week 5** | Error Log Analyzer + OCR Screenshot Analyzer | ✅ Done |
| **Week 6** | AI Troubleshooter (Google Gemini integration) | ✅ Done |
| **Future** | Automated diagnostics + Dependency analysis | 🔜 Planned |

---

## 🤝 Contributing

This is a personal learning project, but PRs and suggestions are always welcome!

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 👨‍💻 Author

**Sakshu4** — building real tools while learning full-stack development.

> *"Built to solve the real problems that every fresher developer faces."*

---

<div align="center">

⭐ **If this project helped you, give it a star!** ⭐

</div>