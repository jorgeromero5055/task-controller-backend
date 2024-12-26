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

## Live Demo

A hosted version of the app is available at the following link:

Note: The app may take up to 30 seconds to respond to a request if it has been inactive for more than 15 minutes. This delay is due to the backend being hosted on Render’s free tier, which incurs a server cold start when inactive for more than 15 minutes.

[Live App Link](https://task-controller-frontend.vercel.app/signup)

---

## Setup Requirements

To spin up this app locally, you'll need the following.

1. A Firebase Authentication account to add the following enviornment variables

FIREBASE_CONFIG={ Your Firebase Authentication JSON value }

2. Access to a Mongo Database URI to add the following enviornment variable

MONGODB_URI={ Your Mongo DB URI }

3. Set the PORT enviornment variable to 4000 as seen below

PORT="4000"

---

## How to Run Locally

1. Clone the repository:
   git clone https://github.com/your-repo/task-controller-backend.git

2. Add a .env file with the enviornment variables stated in the Setup Requirements above.

3. Navigate to the project directory:
   cd task-controller-backend

4. Install dependencies:
   npm install

5. Start the server:
   npm start

---

## Frontend

This backend is designed to work with the frontend portion of the Task Controller App, which provides the user interface and functionality for managing tasks. The frontend repository contains all the React.js code for the application.

[Backend Repository Link](https://github.com/jorgeromero5055/task-controller-frontend)
