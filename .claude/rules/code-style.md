---
description: Frontend (TypeScript/React) and backend (Java/Spring Boot) coding standards
alwaysApply: false
globs:
  - "frontend/**/*.ts"
  - "frontend/**/*.tsx"
  - "backend/**/*.java"
---

# Code Style

## Frontend (TypeScript / React)

### General

- TypeScript strict mode is enabled — no `any`, no `@ts-ignore`
- Functional components only — no class components
- No inline styles — Tailwind classes only
- No component-level CSS files — all styling via Tailwind and `globals.css` variables

### Hooks

- All data fetching lives in custom hooks: `useCoursesQuery`, `useQuizAttempt`, `useLessonProgress`, etc.
- TanStack Query for server state; Zustand for global client state
- Never call `fetch` or `axios` directly inside a component body

### Structure

- Feature-based folder layout under `src/features/`, not type-based
- Shared components in `src/components/`
- shadcn/ui components are the base — extend via the `className` prop, never fork them

### Comments

- Default to no comments
- Add a comment only when the **why** is non-obvious: a workaround, a hidden constraint, or subtle invariant
- Never describe what the code does — the code does that

---

## Backend (Java / Spring Boot)

### Dependency Injection

- Constructor injection only — never `@Autowired` on fields

### Layers

- **Controller:** HTTP mapping and input validation only — no business logic
- **Service:** All business logic lives here
- **Repository:** JPA queries only — no logic in repositories
- DTOs for every request and response body — entities never cross the API boundary

### Validation & Error Handling

- Use `@Valid` + Jakarta Bean Validation annotations on request DTOs
- One global `@RestControllerAdvice` handles all exceptions and maps them to the error envelope
- Never let exceptions bubble up as 500 responses with stack traces

### Naming

- Classes: `PascalCase`
- Methods / fields: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- DB columns map to `snake_case` via Hibernate naming strategy
