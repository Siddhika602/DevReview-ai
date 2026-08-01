# DevReview AI - Premium AI Code Review Platform

DevReview AI is a full-stack code review and statistics dashboard. It allows developers to submit source code for comprehensive audits powered by the Google Gemini API (with support for C++, C, Java, JavaScript, Python, and SQL).

## Features

- **Authentication**: JWT-based Sign Up, Login, and Profile updates with encrypted password storage.
- **AI-Powered Analysis**: Audits code for Bugs, Security risks, Performance bottlenecks, Readability, Best Practices, and suggested improvements.
- **Interactive Review Report**: Display of category-wise ratings with custom badges and custom Markdown layouts, coupled with a read-only Monaco Diff editor displaying refactored code.
- **Statistics Dashboard**: Visual indicators showing overall audit metrics, averages, and flagged vulnerabilities.
- **Logs Archives**: Detailed review logs history with live search, language filtering, and sorting.
- **Theme Selection**: Seamless global dark/light mode toggle.
- **Responsive Layout**: Collapsible sidebar, optimized charts, and mobile-friendly layout support.

---

## Tech Stack

### Frontend
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS v4.0
- **Routing**: React Router v6
- **Code Editor**: Monaco Code Editor (`@monaco-editor/react`)
- **API Client**: Axios

### Backend
- **Server**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JSON Web Token (JWT) & bcryptjs
- **AI Core**: Google Gemini SDK (`@google/generative-ai`)

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) installed
- [MongoDB](https://www.mongodb.com/) running locally (port `27017`) or a remote MongoDB Atlas URI

### Configuration
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Open the `.env` file and replace the `GEMINI_API_KEY` placeholder with your actual Google Gemini API Key:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```
   *Note: If no API key is specified, the application will fallback to a simulated "Mock Review Mode" so you can test all features and layouts immediately!*

---

## Installation & Running

You need to start both the backend server and the frontend development server.

### 1. Launch the Backend Server
```bash
cd backend
npm install
npm run dev
```
The server will run on [http://localhost:5000](http://localhost:5000).

### 2. Launch the Frontend React client
```bash
cd frontend
npm install
npm run dev
```
The client dev server will run on [http://localhost:3000](http://localhost:3000).

---

## Testing / Verification
We include an integration script `backend/src/verify.js` to verify server functionality. See logs for details.
