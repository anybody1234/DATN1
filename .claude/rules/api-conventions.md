---
description: REST API conventions, response format, error format, pagination, and authentication endpoints
alwaysApply: false
globs:
  - "backend/**/controller/**"
  - "frontend/**/lib/axios*"
  - "frontend/**/lib/api*"
  - "frontend/**/hooks/use*"
---

# API Conventions

## Base URL

```
/api/v1
```

## Response Envelope

Every response — success or error — is wrapped in this envelope:

```json
// Success
{ "success": true, "data": <T>, "message": "optional" }

// Error
{ "success": false, "error": { "code": "ERROR_CODE", "message": "Human-readable message" } }
```

Never return raw data without the envelope. Never expose stack traces.

## Pagination

Request params: `?page=0&size=20`

Response shape:
```json
{
  "success": true,
  "data": {
    "content": [],
    "totalPages": 5,
    "totalElements": 97,
    "page": 0,
    "size": 20
  }
}
```

## Authentication

- Header: `Authorization: Bearer <access_token>`
- Access token TTL: 15 minutes
- Refresh token TTL: 7 days, stored in `httpOnly` cookie

### Auth Endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Get tokens |
| POST | `/api/auth/refresh` | Rotate access token using refresh cookie |
| POST | `/api/auth/logout` | Invalidate refresh token |

## Error Codes

Use consistent `SCREAMING_SNAKE_CASE` codes in the error envelope so the frontend can branch on them without parsing message strings. Examples:

- `UNAUTHORIZED` — missing or invalid token
- `FORBIDDEN` — authenticated but insufficient role
- `NOT_FOUND` — resource does not exist
- `VALIDATION_ERROR` — request body failed `@Valid` checks
- `DUPLICATE_EMAIL` — registration with existing email
