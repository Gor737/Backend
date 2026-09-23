# Productivity API

A simple REST API built with Node.js using only the built-in `http` module.

The API provides three independent resources:

- Notes
- Tasks
- Contacts

All data is stored in memory and is reset when the server is restarted.

## Technologies

- Node.js
- Built-in `http` module
- In-memory arrays

No external packages or frameworks are used.

## Getting Started

### Start the server

```bash
node server.js

The port can be configured using the PORT environment variable.

API Endpoints
Notes
Note structure
{
  "id": 1,
  "title": "First note",
  "content": "Hello world"
}
Get all notes
GET /notes

Returns all notes.

Response: 200 OK

Create a note
POST /notes

Request body:

{
  "title": "First note",
  "content": "Hello world"
}

Both title and content are required.

Response: 201 Created

Get a note
GET /notes/:id

Example:

GET /notes/1

Response: 200 OK

If the note does not exist:

Response: 404 Not Found

Update a note
PUT /notes/:id

Example request body:

{
  "title": "Updated note"
}

The provided fields are updated while the other fields remain unchanged.

Response: 200 OK

Delete a note
DELETE /notes/:id

Response: 200 OK

Tasks
Task structure
{
  "id": 1,
  "title": "Learn Node.js",
  "completed": false
}
Get all tasks
GET /tasks

Response: 200 OK

Create a task
POST /tasks

Request body:

{
  "title": "Learn Node.js"
}

title is required.

If completed is not provided, it defaults to false.

Response: 201 Created

Get a task
GET /tasks/:id

Example:

GET /tasks/1

Response: 200 OK

If the task does not exist:

Response: 404 Not Found

Update a task
PUT /tasks/:id

Example request body:

{
  "completed": true
}

The provided fields are updated while the other fields remain unchanged.

Response: 200 OK

Delete a task
DELETE /tasks/:id

Response: 200 OK

Contacts
Contact structure
{
  "id": 1,
  "name": "Gor",
  "email": "gor@example.com",
  "phone": null
}
Get all contacts
GET /contacts

Response: 200 OK

Create a contact
POST /contacts

Request body:

{
  "name": "Gor",
  "email": "gor@example.com"
}

name and email are required.

phone is optional. If it is not provided, it is stored as null.

Response: 201 Created

Get a contact
GET /contacts/:id

Example:

GET /contacts/1

Response: 200 OK

If the contact does not exist:

Response: 404 Not Found

Update a contact
PUT /contacts/:id

Example request body:

{
  "phone": "+37499123456"
}

The provided fields are updated while the other fields remain unchanged.

Response: 200 OK

Delete a contact
DELETE /contacts/:id

Response: 200 OK

HTTP Status Codes
Status Code	Description
200	Successful request
201	Resource successfully created
400	Bad request or malformed JSON
404	Resource or route not found
405	HTTP method not allowed
500	Internal server error
Error Handling

The API handles the following errors:

Missing required fields → 400 Bad Request
Malformed JSON → 400 Bad Request
Resource not found → 404 Not Found
Unknown route → 404 Not Found
Unsupported HTTP method → 405 Method Not Allowed
Data Storage

The API uses in-memory JavaScript arrays to store data.

There is no database.

All data is lost when the server is restarted.

The three resources are completely independent:

Notes
Tasks
Contacts

There are no relationships or foreign keys between them.

Example Requests
Create a note
curl -X POST http://localhost:3000/notes \
-H "Content-Type: application/json" \
-d '{"title":"First note","content":"Hello world"}'
Create a task
curl -X POST http://localhost:3000/tasks \
-H "Content-Type: application/json" \
-d '{"title":"Learn Node.js"}'
Create a contact
curl -X POST http://localhost:3000/contacts \
-H "Content-Type: application/json" \
-d '{"name":"Gor","email":"gor@example.com"}'
Get all notes
curl http://localhost:3000/notes
Update a task
curl -X PUT http://localhost:3000/tasks/1 \
-H "Content-Type: application/json" \
-d '{"completed":true}'
Delete a contact
curl -X DELETE http://localhost:3000/contacts/1
Implementation

The server is implemented directly with Node.js's built-in http module.

Request bodies are manually collected from the request stream using the data and end events.

The received body is parsed using JSON.parse().

No external frameworks or libraries such as Express, Fastify, or body-parser are used.

Project Structure
.
├── server.js
└── README.md