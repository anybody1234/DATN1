---
description: Project identity, timeline, scope constraints, and development environment setup for NihongoFlow
alwaysApply: true
---

# Project Overview

NihongoFlow is an online Japanese learning platform built through video lessons with integrated quizzes. This is a solo bachelor's thesis project at Hanoi University of Science and Technology (SOICT), Semester 2025.2.

- **Student:** Phan Hoàng Long (MSSV: 20225738)
- **Supervisor:** Trịnh Anh Phúc
- **Timeline:** 27/02/2026 – 28/06/2026

## Constraints

- Solo project — keep scope realistic, do not over-engineer
- No payment or subscription system
- No real-time features (no WebSocket)
- Vietnamese UI language (all labels and messages in Vietnamese)
- Japanese content uses proper Unicode — verify rendering across browsers
- Mobile-responsive but desktop-first design

## Repository Structure

Monorepo — `/frontend` and `/backend` in one repository:

```
DATN1/
├── frontend/              # ReactJS app
│   ├── src/
│   │   ├── components/    # Reusable UI components (shadcn + custom)
│   │   ├── pages/         # Route-level page components
│   │   ├── features/      # Feature slices (auth, course, quiz, progress)
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utilities, axios instance, constants
│   │   ├── store/         # Zustand stores
│   │   └── types/         # TypeScript interfaces
│   ├── public/
│   └── package.json
├── backend/               # Spring Boot app
│   ├── src/main/java/com/nihongoflow/
│   │   ├── controller/
│   │   ├── service/
│   │   ├── repository/
│   │   ├── entity/
│   │   ├── dto/
│   │   ├── security/      # JWT filter, UserDetailsService
│   │   └── config/
│   └── pom.xml
├── docker-compose.yml
└── CLAUDE.md
```

## Development Setup

```bash
# Start MySQL via Docker
docker compose up -d mysql

# Backend (port 8080)
cd backend && mvn spring-boot:run

# Frontend (port 5173)
cd frontend && npm install && npm run dev
```

## Environment Variables

### Backend (`backend/src/main/resources/application.yml`)
```yaml
spring.datasource.url: jdbc:mysql://localhost:3306/nihongoflow
spring.datasource.username: ${DB_USERNAME}
spring.datasource.password: ${DB_PASSWORD}
jwt.secret: ${JWT_SECRET}
jwt.access-expiration: 900000       # 15 minutes
jwt.refresh-expiration: 604800000   # 7 days
cloudinary.cloud-name: ${CLOUDINARY_CLOUD_NAME}
cloudinary.api-key: ${CLOUDINARY_API_KEY}
cloudinary.api-secret: ${CLOUDINARY_API_SECRET}
```

### Frontend (`frontend/.env`)
```
VITE_API_BASE_URL=http://localhost:8080/api/v1
```
