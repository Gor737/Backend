# Online Course Platform API

A backend API for an online learning platform built with Node.js, Express, PostgreSQL, and Sequelize. It supports user authentication, role-based authorization, course and lesson management, and student enrollment tracking.

## Overview

This project provides the backend services for a course marketplace where:

- Admins can manage users and view enrollments.
- Instructors can create and manage their own courses and lessons.
- Students can register, browse published courses, enroll, and track progress.

The application auto-creates the PostgreSQL database if it does not exist, syncs models on startup, and includes a seed script for initial demo data.

## Features

- JWT-based authentication with access and refresh tokens
- Role-based access control for admin, instructor, and student users
- Public course listing for published courses
- Instructor-owned course and lesson management
- Student enrollment with `active`, `completed`, and `cancelled` states
- Progress tracking for each enrollment
- Admin endpoints for viewing users and all enrollments
- Database bootstrap and seed support

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- JWT authentication (`jsonwebtoken`)
- Password hashing (`bcryptjs`)
- Environment config via `dotenv`

## Folder Structure

```text
Online_Course_Platform/
├── .env.example
├── package.json
├── README.md
├── src/
│   ├── app.js
│   ├── seed.js
│   ├── server.js
│   ├── config/
│   │   ├── database.js
│   │   └── env.js
│   ├── constants/
│   │   ├── auth.errors.js
│   │   ├── course.errors.js
│   │   ├── enrollment.errors.js
│   │   ├── lesson.errors.js
│   │   └── user.errors.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── course.controller.js
│   │   ├── enrollment.controller.js
│   │   ├── lesson.controller.js
│   │   └── user.controller.js
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── course.model.js
│   │   ├── enrollment.model.js
│   │   ├── index.js
│   │   ├── lesson.model.js
│   │   └── user.model.js
│   ├── routes/
│   │   ├── auth.route.js
│   │   ├── course.route.js
│   │   ├── enrollment.route.js
│   │   ├── index.js
│   │   ├── lesson.route.js
│   │   └── user.route.js
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── course.service.js
│   │   ├── enrollment.service.js
│   │   ├── lesson.service.js
│   │   └── user.service.js
│   ├── utils/
│   │   ├── AppError.js
│   │   ├── asyncHandler.js
│   │   └── jwt.js
│   └── seed.example.js
└── postman/
    ├── collections/
    ├── documents/
    ├── environments/
    ├── flows/
    ├── globals/
    ├── mocks/
    └── specs/
```

## Installation and Setup

1. Install dependencies:

```bash
npm install
```

2. Create a local environment file:

```bash
cp .env.example .env
```

3. Fill in the environment values.

## Environment Variables

The project reads values from a `.env` file. Example:

```env
PORT=3000

DB_NAME=online_course_platform
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_DIALECT=postgres
DB_DEFAULT_NAME=postgres

JWT_SECRET=your_access_token_secret
JWT_EXPIRES_IN=1h

JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_REFRESH_EXPIRES_IN=7d
```

Notes:

- `DB_DEFAULT_NAME` is used to create the target database if it does not already exist.
- `JWT_SECRET` and `JWT_REFRESH_SECRET` should be set to secure random values in development and production.

## Database Setup

This project uses PostgreSQL with Sequelize.

When the server starts, it does the following:

- checks whether the configured database exists
- creates it if needed
- authenticates the connection
- runs `sequelize.sync({ alter: true })`

That means the database schema is created or updated automatically on startup. You still need PostgreSQL installed and accessible from the configured host/port.

## Seed Data

The project includes a seed script that creates a default admin, instructor, and student account, plus a sample course and lessons.

Run:

```bash
npm run seed
```

Default seeded accounts:

- Admin: `admin03@gmail.com` / `ILoveNelly`
- Instructor: `instructor03@gmail.com` / `ILoveNelly`
- Student: `student03@gmail.com` / `ILoveNelly`

## Running the Server

Start the API in development mode:

```bash
npm run dev
```

Or run the production-style start script:

```bash
npm start
```

The server listens on the `PORT` value from the environment file.

## Authentication and Roles

The API uses Bearer JWT authentication.

Add the access token to requests:

```http
Authorization: Bearer <access_token>
```

Roles supported by the app:

- `admin`
- `instructor`
- `student`

Authorization rules implemented in the code:

- `admin`: full access to user and enrollment management
- `instructor`: can create, update, and delete their own courses and lessons
- `student`: can enroll in published courses, view enrolled lessons, and update their own enrollment progress

## API Endpoints

Base URL:

```text
http://localhost:<PORT>/api
```

### Auth

| Method | Endpoint             | Access        | Description                  |
| ------ | -------------------- | ------------- | ---------------------------- |
| POST   | `/api/auth/register` | Public        | Register a new user          |
| POST   | `/api/auth/login`    | Public        | Login and receive JWT tokens |
| GET    | `/api/auth/me`       | Authenticated | Get current user profile     |
| POST   | `/api/auth/refresh`  | Public        | Refresh an access token      |

Example request:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Jane Doe",
    "email": "jane@example.com",
    "password": "secret123"
  }'
```

Example response:

```json
{
  "success": true,
  "data": {
    "fullName": "Jane Doe",
    "email": "jane@example.com"
  }
}
```

Login example:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student03@gmail.com",
    "password": "ILoveNelly"
  }'
```

Response:

```json
{
  "success": true,
  "data": {
    "accessToken": "<jwt>",
    "refreshToken": "<jwt>",
    "user": {
      "id": 3,
      "fullName": "Gor Afyan",
      "email": "student03@gmail.com",
      "role": "student"
    }
  }
}
```

### Users

| Method | Endpoint              | Access | Description                          |
| ------ | --------------------- | ------ | ------------------------------------ |
| GET    | `/api/users`          | Admin  | List users with pagination/filtering |
| GET    | `/api/users/:id`      | Admin  | Get a user by ID                     |
| POST   | `/api/users`          | Admin  | Create a user                        |
| PATCH  | `/api/users/:id/role` | Admin  | Update a user's role                 |
| DELETE | `/api/users/:id`      | Admin  | Delete a user                        |

Query parameters for `GET /api/users`:

- `page`
- `limit`
- `role` (`student`, `instructor`, `admin`)

Example:

```bash
curl -X GET "http://localhost:3000/api/users?page=1&limit=10&role=student" \
  -H "Authorization: Bearer <access_token>"
```

### Courses

| Method | Endpoint                    | Access               | Description                              |
| ------ | --------------------------- | -------------------- | ---------------------------------------- |
| GET    | `/api/courses`              | Public               | List published courses                   |
| GET    | `/api/courses/my`           | Instructor           | List courses owned by current instructor |
| GET    | `/api/courses/:id`          | Public/Authenticated | Get a course by ID                       |
| POST   | `/api/courses`              | Instructor/Admin     | Create a course                          |
| PUT    | `/api/courses/:id`          | Instructor/Admin     | Update a course                          |
| DELETE | `/api/courses/:id`          | Instructor/Admin     | Delete a course                          |
| GET    | `/api/courses/:id/students` | Instructor/Admin     | List students enrolled in a course       |

Course creation example:

```bash
curl -X POST http://localhost:3000/api/courses \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Node.js Fundamentals",
    "description": "Learn the basics of Node.js and Express.",
    "category": "Web Development",
    "level": "beginner",
    "price": 2500
  }'
```

Course fields:

- `title` (required)
- `description` (required)
- `category` (required)
- `level` (`beginner`, `intermediate`, `advanced`)
- `price` (number, minimum `0`)

### Lessons

| Method | Endpoint                         | Access           | Description               |
| ------ | -------------------------------- | ---------------- | ------------------------- |
| GET    | `/api/courses/:courseId/lessons` | Authenticated    | List lessons for a course |
| GET    | `/api/lessons/:id`               | Authenticated    | Get a lesson by ID        |
| POST   | `/api/courses/:courseId/lessons` | Instructor/Admin | Create a lesson           |
| PUT    | `/api/lessons/:id`               | Instructor/Admin | Update a lesson           |
| DELETE | `/api/lessons/:id`               | Instructor/Admin | Delete a lesson           |

For students, lesson access is restricted to enrolled courses. A student must be enrolled in the course and have an `active` or `completed` enrollment.

Lesson creation example:

```bash
curl -X POST http://localhost:3000/api/courses/1/lessons \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Introduction to Express",
    "content": "Learn what Express is and how it works.",
    "videoUrl": "https://example.com/video.mp4",
    "duration": 20,
    "order": 1
  }'
```

### Enrollments

| Method | Endpoint                        | Access        | Description                    |
| ------ | ------------------------------- | ------------- | ------------------------------ |
| POST   | `/api/enrollments`              | Student       | Enroll in a published course   |
| GET    | `/api/enrollments/me`           | Student       | Get current user's enrollments |
| PATCH  | `/api/enrollments/:id/progress` | Student       | Update enrollment progress     |
| DELETE | `/api/enrollments/:id`          | Student/Admin | Cancel an enrollment           |
| GET    | `/api/enrollments`              | Admin         | View all enrollments           |

Enrollment example:

```bash
curl -X POST http://localhost:3000/api/enrollments \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "courseId": 1
  }'
```

Progress update example:

```bash
curl -X PATCH http://localhost:3000/api/enrollments/1/progress \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "progress": 65
  }'
```

Enrollment progress is validated between `0` and `100`. When progress reaches `100`, the enrollment status becomes `completed`.

## Example Response Shape

A typical successful response follows this structure:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "JavaScript Fundamentals"
  }
}
```

Errors use the application error layer and return a structured error response, for example:

```json
{
  "success": false,
  "statusCode": 404,
  "message": "Course not found"
}
```

## Notes

- Public course discovery is limited to courses with `isPublished = true`.
- The project currently includes a sample course and lessons, created by the seed script.
- The codebase exposes an `optionalAuthenticate` middleware for route-level access that can behave differently depending on whether a user is logged in.

## License

This project is licensed under the ISC license as defined in `package.json`.
