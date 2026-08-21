# Task Management API (Mini Todo Backend)

A REST API to manage tasks (mini todo backend), built with Node.js and Express. Data is persisted in a local JSON file instead of a database.

## Features

- Full CRUD operations for tasks
- Pagination, filtering by status, and sorting by due date
- Rate limiting middleware
- MVC folder structure
- Centralized error handling
- Request logging middleware
- Input validation
- Async/await for all file operations
- Environment variable configuration with dotenv

## Folder Structure

src/
├── controllers/ # Request handlers (business logic)
│ └── taskController.js
├── routes/ # API route definitions
│ └── taskRoutes.js
├── models/ # Data access layer (JSON file read/write)
│ └── taskModel.js
├── middleware/ # Custom middleware
│ ├── logger.js
│ ├── errorHandler.js
│ └── rateLimiter.js
├── config/ # App configuration
│ └── config.js
└── app.js # App entry point
data/
└── tasks.json # Local JSON data store


## Data Model: Task

| Field         | Type    | Description                              |
|----------------|---------|--------------------------------------------|
| id              | String  | Auto-generated (UUID), unique              |
| title           | String  | Required                                  |
| description     | String  | Optional                                  |
| priority         | Enum    | Low, Medium, High                          |
| status           | Enum    | Pending, InProgress, Completed             |
| dueDate          | String  | ISO date string                            |
| createdAt        | String  | ISO date, set on creation                  |
| updatedAt        | String  | ISO date, set on creation/update           |

## Setup Instructions

1. Clone this repository
2. Install dependencies:
```bash
   npm install
```
3. Create a `.env` file in the root directory (see `.env.example`):

PORT=5000
NODE_ENV=development

4. Start the server:
```bash
   npm run dev
```
5. Server will run at `http://localhost:5000`

## API Endpoints

### 1. Create Task

POST /api/tasks

Body:
```json
{
  "title": "Finish backend task",
  "description": "Complete task 2 API",
  "priority": "High",
  "status": "Pending",
  "dueDate": "2026-08-20"
}
```

### 2. Get All Tasks (with pagination, filter, sort)

GET /api/tasks?page=1&limit=10&status=Pending&sort=asc

All query parameters are optional:
- `page`, `limit` — pagination controls
- `status` — filter by Pending, InProgress, or Completed
- `sort` — asc or desc, sorted by dueDate

### 3. Get Task by ID

GET /api/tasks/:id


### 4. Update Task

PUT /api/tasks/:id

Body (any subset of fields):
```json
{
  "status": "InProgress"
}
```

### 5. Delete Task

DELETE /api/tasks/:id


## Rate Limiting

All endpoints are protected by a rate limiter (100 requests per minute per IP) to prevent abuse.

## Testing

A Postman collection is included in the project root. Import it into Postman to test all endpoints.

## Tech Stack

- Node.js
- Express.js
- dotenv
- express-rate-limit
- Native `fs/promises` and `crypto` modules
