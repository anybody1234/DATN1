---
description: Technology choices for frontend, backend, database, video storage, and infrastructure
alwaysApply: false
globs:
  - "frontend/**"
  - "backend/**"
  - "docker-compose.yml"
  - "pom.xml"
  - "package.json"
---

# Tech Stack

## Frontend

| Concern | Choice |
|---|---|
| Framework | ReactJS (Vite) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Global state | Zustand |
| Server state | TanStack Query |
| Routing | React Router v6 |
| Video player | Video.js or React Player (Cloudinary HLS) |
| HTTP client | Axios |
| Language | TypeScript (strict mode) |

## Backend

| Concern | Choice |
|---|---|
| Framework | Spring Boot 3.x |
| Language | Java 21 |
| Auth | Spring Security + JWT |
| ORM | Spring Data JPA / Hibernate |
| Build tool | Maven |

## Database

- **Primary:** MySQL 8.x
- **Migrations:** Flyway (never manual schema changes)

## Storage & Video

- **Video hosting:** Cloudinary (upload + adaptive streaming)
- **Video format:** HLS (m3u8) via Cloudinary transformation pipeline
- **Image hosting:** Cloudinary

## Infrastructure

- **Repo structure:** Monorepo — frontend and backend in one repo
- **API style:** RESTful JSON
- **Dev environment:** Docker Compose (MySQL + backend + frontend)
