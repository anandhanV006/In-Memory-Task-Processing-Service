# Task Service - In-Memory REST API

A simple REST API for managing tasks in memory using Node.js and Express.

## Features

- Create, Read, Update, Delete tasks
- Filter tasks by status and priority
- Sort tasks by creation date
- Soft delete support
- Input validation
- 90%+ test coverage

## Installation

```bash
# Install dependencies
npm install

# Start the server
npm start

# Or run in development mode
npm run dev
```

Server will start on `http://localhost:3000`

## API Endpoints

### Create Task
```bash
POST /tasks
Content-Type: application/json

{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "status": "todo",
  "priority": "high"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "id": "uuid-here",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "status": "todo",
    "priority": "high",
    "createdAt": "2024-02-10T10:00:00.000Z",
    "updatedAt": "2024-02-10T10:00:00.000Z",
    "isDeleted": false
  }
}
```

### Get All Tasks
```bash
GET /tasks
```

**With filters:**
```bash
# Filter by status
GET /tasks?status=todo

# Filter by priority
GET /tasks?priority=high

# Sort by creation date
GET /tasks?sortBy=createdAt&sortOrder=desc

# Combine filters
GET /tasks?status=todo&priority=high&sortBy=createdAt&sortOrder=asc
```

### Get Single Task
```bash
GET /tasks/:id
```

### Update Task
```bash
PUT /tasks/:id
Content-Type: application/json

{
  "title": "Updated title",
  "status": "done",
  "priority": "medium"
}
```

### Delete Task
```bash
# Soft delete (default)
DELETE /tasks/:id

# Hard delete (permanent)
DELETE /tasks/:id?hard=true
```

### Get Statistics
```bash
GET /tasks/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 10,
    "byStatus": {
      "todo": 4,
      "in_progress": 3,
      "done": 3
    },
    "byPriority": {
      "low": 2,
      "medium": 5,
      "high": 3
    }
  }
}
```

### Health Check
```bash
GET /health
```

## Task Model

```javascript
{
  id: string,           // Auto-generated UUID
  title: string,        // Required, 3-100 characters
  description: string,  // Optional, max 500 characters
  status: string,       // "todo" | "in_progress" | "done"
  priority: string,     // "low" | "medium" | "high"
  createdAt: Date,      // Auto-generated
  updatedAt: Date,      // Auto-updated
  isDeleted: boolean    // For soft delete
}
```

## Validation Rules

### Create Task
- `title`: Required, 3-100 characters
- `description`: Optional, max 500 characters
- `status`: Optional, must be: `todo`, `in_progress`, or `done`
- `priority`: Optional, must be: `low`, `medium`, or `high`

### Update Task
- At least one field must be provided
- Same validation rules as create

### Filters
- `status`: Must be valid status value
- `priority`: Must be valid priority value
- `sortBy`: Only `createdAt` supported
- `sortOrder`: `asc` or `desc`

## Project Structure

```
task-service/
├── src/
│   ├── controllers/
│   │   └── taskController.js    # Request handlers
│   ├── routes/
│   │   └── taskRoutes.js        # API routes
│   ├── services/
│   │   └── taskService.js       # Business logic
│   ├── store/
│   │   └── taskStore.js         # In-memory storage
│   ├── utils/
│   │   └── validation.js        # Validation helpers
│   ├── __tests__/
│   │   ├── api.test.js          # API tests
│   │   └── taskService.test.js  # Service tests
│   ├── app.js                   # Express app
│   └── server.js                # Server entry
├── package.json
└── README.md
```

## Testing

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage
```

## Examples

### Create and Update Task

```bash
# Create task
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete assignment",
    "priority": "high"
  }'

# Response will include task ID
# Use that ID to update

curl -X PUT http://localhost:3000/tasks/{TASK_ID} \
  -H "Content-Type: application/json" \
  -d '{
    "status": "done"
  }'
```

### Filter and Sort

```bash
# Get all high priority tasks
curl http://localhost:3000/tasks?priority=high

# Get all todos, sorted by newest first
curl http://localhost:3000/tasks?status=todo&sortBy=createdAt&sortOrder=desc

# Get in-progress tasks with high priority
curl http://localhost:3000/tasks?status=in_progress&priority=high
```

## Notes

- All data is stored in memory (lost on server restart)
- Tasks are soft-deleted by default
- UUID v4 is used for task IDs
- All dates are in ISO 8601 format

## Requirements

- Node.js 14+
- npm or yarn

## License

MIT
