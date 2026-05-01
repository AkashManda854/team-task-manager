# Team Task Manager - API Testing Guide

## Base URL
```
http://localhost:5000/api
```

## Authentication Headers
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

---

## 1. Authentication Endpoints

### Sign Up
```bash
POST /auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "message": "User created successfully",
  "token": "eyJhbGc...",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Member"
  }
}
```

### Login
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "message": "Login successful",
  "token": "eyJhbGc...",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Admin"
  }
}
```

---

## 2. Project Endpoints

### Create Project (Admin Only)
```bash
POST /projects
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "name": "Website Redesign",
  "description": "Redesign company website"
}

Response:
{
  "message": "Project created successfully",
  "project": {
    "_id": "project_id",
    "name": "Website Redesign",
    "description": "Redesign company website",
    "createdBy": { ... },
    "members": [ ... ],
    "createdAt": "2024-01-15T10:00:00Z"
  }
}
```

### Get All Projects
```bash
GET /projects
Authorization: Bearer <TOKEN>

Response:
{
  "message": "Projects retrieved successfully",
  "projects": [
    {
      "_id": "project_id",
      "name": "Website Redesign",
      "description": "...",
      "createdBy": { ... },
      "members": [ ... ],
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ]
}
```

### Get Single Project
```bash
GET /projects/:projectId
Authorization: Bearer <TOKEN>

Response:
{
  "message": "Project retrieved successfully",
  "project": {
    "_id": "project_id",
    "name": "Website Redesign",
    "description": "...",
    "createdBy": { ... },
    "members": [ ... ],
    "createdAt": "2024-01-15T10:00:00Z"
  }
}
```

### Add Member to Project (Admin Only)
```bash
PUT /projects/add-member
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "projectId": "project_id",
  "memberEmail": "jane@example.com"
}

Response:
{
  "message": "Member added successfully",
  "project": { ... }
}
```

### Remove Member from Project (Admin Only)
```bash
PUT /projects/remove-member
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "projectId": "project_id",
  "memberId": "user_id"
}

Response:
{
  "message": "Member removed successfully",
  "project": { ... }
}
```

---

## 3. Task Endpoints

### Create Task
```bash
POST /tasks
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "title": "Design Homepage",
  "description": "Create mockups for homepage",
  "assignedTo": "user_id",
  "projectId": "project_id",
  "dueDate": "2024-02-01"
}

Response:
{
  "message": "Task created successfully",
  "task": {
    "_id": "task_id",
    "title": "Design Homepage",
    "description": "Create mockups for homepage",
    "status": "Pending",
    "assignedTo": { ... },
    "projectId": { ... },
    "dueDate": "2024-02-01T00:00:00Z",
    "createdBy": { ... },
    "createdAt": "2024-01-15T10:00:00Z"
  }
}
```

### Get Tasks
```bash
GET /tasks
Authorization: Bearer <TOKEN>

Optional Query Parameters:
- projectId: Filter by project
- status: Filter by status (Pending, In Progress, Completed)

Examples:
GET /tasks?projectId=project_id
GET /tasks?status=Pending
GET /tasks?projectId=project_id&status=In Progress

Response:
{
  "message": "Tasks retrieved successfully",
  "tasks": [
    {
      "_id": "task_id",
      "title": "Design Homepage",
      "description": "...",
      "status": "In Progress",
      "assignedTo": { ... },
      "projectId": { ... },
      "dueDate": "2024-02-01T00:00:00Z",
      "createdBy": { ... },
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ]
}
```

### Update Task
```bash
PUT /tasks/:taskId
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "status": "In Progress",
  "description": "Updating description",
  "dueDate": "2024-02-05"
}

Response:
{
  "message": "Task updated successfully",
  "task": { ... }
}
```

### Delete Task
```bash
DELETE /tasks/:taskId
Authorization: Bearer <TOKEN>

Response:
{
  "message": "Task deleted successfully"
}
```

---

## Testing with cURL

### Sign Up
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create Project
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Project",
    "description": "Project description"
  }'
```

### Create Task
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Task Title",
    "description": "Task description",
    "assignedTo": "<USER_ID>",
    "projectId": "<PROJECT_ID>",
    "dueDate": "2024-02-01"
  }'
```

### Get All Tasks
```bash
curl -X GET "http://localhost:5000/api/tasks" \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json"
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Please provide name, email, and password"
}
```

### 401 Unauthorized
```json
{
  "message": "No token, authorization denied"
}
```

### 403 Forbidden
```json
{
  "message": "Access denied. Required role: Admin"
}
```

### 404 Not Found
```json
{
  "message": "Project not found"
}
```

### 500 Server Error
```json
{
  "message": "Server error",
  "error": "error details"
}
```

---

## Testing Tools

### Postman
1. Import the requests above
2. Set Authorization header with Bearer token
3. Test each endpoint

### VS Code REST Client
Create `test.http` file:
```
@baseUrl = http://localhost:5000/api
@token = <YOUR_JWT_TOKEN>

### Sign Up
POST {{baseUrl}}/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

### Login
POST {{baseUrl}}/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

### Get Projects
GET {{baseUrl}}/projects
Authorization: Bearer {{token}}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Successful request |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing/invalid token |
| 403 | Forbidden - Permission denied |
| 404 | Not Found - Resource doesn't exist |
| 500 | Server Error - Internal error |

---

## Notes

- JWT tokens expire in 7 days
- Tokens must be included in Authorization header as "Bearer <TOKEN>"
- Admin role can create projects and assign tasks
- Members can only update task status
- All dates should be in ISO 8601 format (YYYY-MM-DD)
- Task status values: "Pending", "In Progress", "Completed"
