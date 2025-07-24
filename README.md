# 🧠 AI Interview Trainer (Mock Q&A Engine)

AI Interview Trainer is a full-stack web application designed to simulate real-time mock interviews using advanced AI models. It evaluates your answers, scores your performance, and even lets you download interview summaries as PDFs — making it an ideal tool for job preparation.

---

## 🚀 Key Features

- 🎤 **Mock Interviews Powered by AI** – Real-time Q&A using OpenRouter’s AI models.
- 🧠 **Answer Scoring & Feedback** – Evaluates answers for clarity, relevance, and completeness.
- 📄 **PDF Summary Export** – Download detailed summaries of your interview sessions.
- 📜 **Interview History** – View all your past interviews and feedback.
- 🔐 **Authentication** – Secure login using JWT tokens.
- 🌐 **Modern UI** – Built with React, Tailwind CSS, and Vite for a fast and responsive experience.

---

## ⚙️ Setup Instructions

### 📁 Folder Structure

ai-interview-trainer/
├── frontend/ # React + Vite + Tailwind CSS
└── backend/ # Node.js + Express + MongoDB + PDFKit


---

### 🔧 Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
2. Install dependencies:
   ```bash
   npm install
3.Create a .env file in the backend folder and add the following:
  ```env
  PORT=5000
  MONGODB_URI=your_mongodb_connection_string
  OPENROUTER_API_KEY=your_openrouter_api_key
  JWT_SECRET=your_jwt_secret
```
4.Start the backend server:
  ```bash
  npm start
```

### 🔧 Frontend Setup
```bash
cd ../frontend
npm install
```
Update the backend URL inside all API requests (you can use a constant file for this if needed).

Start frontend:
```bash
npm run dev

```
📁 Project Structure
```arduino
oxeir-ai-interview-trainer/
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── utils/
│   ├── index.js
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   └── vite.config.js
│
└── README.md

```
##🧠 AI Logic
- The backend uses OpenRouter's deepseek-chat-v3-0324 model.
- On starting an interview, domain-specific questions are generated.
- User answers are stored, and follow-up questions + feedback are generated.
- A summary is auto-generated and stored.
- A PDF version can be exported using pdfkit.

##🧾 API Endpoints
 - Auth
POST /api/login
Request:
```json
{
  "userId": "1234",
  "name": "Aman"
}
```
Response:
```json
{
  "token": "<JWT_TOKEN>"
}
```
## Interview
- POST /api/interview/start – Start a new interview session
- POST /api/interview/answer – Submit answer and get follow-up
- POST /api/interview/summary – Generate summary of the session
- POST /api/interview/download-pdf – Export summary as PDF

## 🌍 Deployment
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas
  
Make sure to set environment variables correctly on both platforms.

## 🙌 Acknowledgments
- OpenRouter for model access
- DeepSeek for AI model
- Vercel & Render for deployment


