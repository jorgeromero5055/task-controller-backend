# Task Controller Backend

This is the backend server for the **Task Controller App**, built using **Express.js** and **Apollo Server** to handle GraphQL queries and mutations. It provides all backend functionality for user and task management, integrates with Firebase for authentication, and connects to MongoDB to store data.

---

## Features

- **Task Management**:

  - Create, edit, delete, get a single task, or fetch all tasks tied to a specific user.
  - Automatically update tasks to mark them as overdue based on their date and completion status before sending them to the frontend.

- **User Management**:

  - Create, update, and delete user accounts.
  - Validate Firebase tokens to authenticate users.
  - Return "not authenticated" if a user hasn't been active for the last 30 days.

- **Database Integration**:

  - Connects to a MongoDB instance for storing tasks and user data.

- **Token Validation**:
  - Uses Firebase Authentication to validate tokens and ensure secure access.

---

## Tech Stack

- **Backend Framework**: Express.js
- **GraphQL Server**: Apollo Server
- **Database**: MongoDB
- **Authentication**: Firebase Authentication

---

## Setup Requirements

To spin up this server locally, you need the following:

1. **A `.env` file** with the following fields:

- **MONGODB_URI**: The URI to connect to your MongoDB instance.
- **GOOGLE_APPLICATION_CREDENTIALS**: Path to your Firebase service account key file. This file must be added manually and contains the credentials provided by Firebase.

2. **The `firebaseServiceAccount.json` file**:

- This file should be generated from your Firebase project and contain the service account credentials.

Without these fields, the server cannot connect to the database or authenticate users.

---

## How to Run Locally

1. Clone the repository:
   git clone https://github.com/your-repo/task-controller-backend.git

2. Add a .env file to the root of the project with the following:
   MONGODB_URI=your-mongodb-uri
   GOOGLE_APPLICATION_CREDENTIALS=./firebaseServiceAccount.json

3. Add the firebaseServiceAccount.json file to the root of the project.

4. Navigate to the project directory:
   cd task-controller-backend

5. Install dependencies:
   npm install

6. Start the server:
   npm start

Frontend

This backend is designed to work with the frontend portion of the Task Controller App, which provides the user interface and functionality for managing tasks. The frontend repository contains all the React.js code for the application.

[Backend Repository Link](https://github.com/jorgeromero5055/task-controller-frontend)
