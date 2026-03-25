# WTWR (What to Wear?) - Back End

This repository contains the back-end server for the WTWR application. It provides a RESTful API with user authentication and CRUD operations for clothing items.

**Current Sprint:** 15

---

## Project Description

The WTWR back-end allows users to:

- Register and log in securely using JWT tokens
- Add, like, and delete clothing items
- Retrieve all clothing items
- Ensure secure, validated data handling and error management

The back-end is built with Node.js, Express.js, and MongoDB using Mongoose.

---

## Technologies & Techniques

- Node.js — server-side JavaScript runtime
- Express.js — API routing and middleware
- MongoDB / Mongoose — database and object modeling
- JWT Authentication — user login and token verification
- Validator — data validation (emails, URLs)
- ESLint & Prettier — code formatting and linting
- Nodemon — hot reload during development
- Centralized error handling with consistent HTTP status codes

---

## Deployment

- The server can be deployed on any Node.js-compatible host.
- Environment variables are required for `MONGO_URI`, `JWT_SECRET`, and `PORT`.

---

## Notes

- All API routes are protected with JWT authentication.
- CORS is configured to allow front-end communication.
- Error handling uses centralized error classes for clear responses.

---

## Repository

- Backend repository: [https://github.com/Briebestcode30/se_project_express](https://github.com/Briebestcode30/se_project_express)
