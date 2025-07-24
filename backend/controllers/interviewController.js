import dotenv from 'dotenv';
import fetch from 'node-fetch';
import axios from 'axios';
import InterviewSession from '../models/InterviewSession.js';

dotenv.config();

const openRouterHeaders = {
  Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
  'HTTP-Referer': 'http://localhost:5000', // Required
  'X-Title': 'Oxeir Interview Trainer',
  'Content-Type': 'application/json',
};

// 👉 Start Interview
export const startInterview = async (req, res) => {
  const { role, numQuestions = 5 } = req.body;
  const userId = req.user?.userId || 'demo-user'; // ✅ Extract from token

  try {
    const prompt = `
You are an API backend responding with raw JSON only.
Generate ${numQuestions} mock interview questions for a ${role}.
Each question should include:
- question (string)
- difficulty (Easy, Medium, Hard)
- skillTag (e.g., JavaScript, React, Logic)

Respond ONLY with a JSON array, like:
[
  {
    "question": "Explain event delegation in JavaScript.",
    "difficulty": "Medium",
    "skillTag": "JavaScript"
  }
]
`;

    const response = await fetch(`${process.env.OPENROUTER_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: openRouterHeaders,
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL,
        messages: [{ role: "user", content: prompt }],
        stream: false,
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error("OpenRouter Error (Start):", data);
      return res.status(500).json({ error: data.error.message || "OpenRouter error" });
    }

    const rawOutput = data.choices[0].message.content;
    const cleanOutput = rawOutput.replace(/```(?:json)?|```/g, '').trim();
    const questionData = JSON.parse(cleanOutput);


    const newSession = new InterviewSession({
      userId,
      role,
      questions: questionData.map((q) => ({
        question: q.question,
        answer: "",
        feedback: {},
      })),
      startedAt: new Date(),
    });

    const savedSession = await newSession.save();

    res.json({ sessionId: savedSession._id, questions: questionData });

  } catch (error) {
    console.error("OpenRouter Error (Start):", error.message || error);
    res.status(500).json({ error: "Failed to generate interview questions" });
  }
};

// 👉 Submit Answer and Get Feedback
export const submitAnswer = async (req, res) => {
  const { sessionId, questionIndex, userAnswer } = req.body;

  try {
    const session = await InterviewSession.findById(sessionId);
    if (!session) return res.status(404).json({ error: 'Session not found' });

    const questionObj = session.questions[questionIndex];
    if (!questionObj) return res.status(404).json({ error: 'Question not found' });

    const prompt = `
You are an interview feedback expert.
Here is a candidate's answer to the question:

Q: "${questionObj.question}"
A: "${userAnswer}"

Give detailed feedback including:
- strengths (20-30 words)
- improvements (40 words)
- rating (0-10)

Respond ONLY with JSON like:
{
  "strengths": "...",
  "improvements": "...",
  "rating": 7
}
`;

    const response = await axios.post(
      `${process.env.OPENROUTER_BASE_URL}/chat/completions`,
      {
        model: process.env.OPENROUTER_MODEL,
        messages: [{ role: "user", content: prompt }],
        stream: false,
      },
      { headers: openRouterHeaders }
    );

    const feedbackOutput = response.data.choices[0].message.content;
    const cleanOutput = feedbackOutput.replace(/```(?:json)?|```/g, '').trim();
    const feedback = JSON.parse(cleanOutput);

    session.questions[questionIndex].answer = userAnswer;
    session.questions[questionIndex].feedback = feedback;
    await session.save();

    res.json({ feedback });

  } catch (error) {
    console.error("OpenRouter Error (Answer):", error.response?.data || error.message || error);
    res.status(500).json({ error: "Failed to evaluate answer" });
  }
};

// 👉 Get History (Already Working)
export const getHistory = async (req, res) => {
  const { userId } = req.params;
  try {
    const sessions = await InterviewSession.find({ userId });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
};

// 👉 Save Summary (Placeholder)
// 👉 Save Summary
export const saveSummary = async (req, res) => {
  const { sessionId } = req.body;

  try {
    const session = await InterviewSession.findById(sessionId);
    if (!session) return res.status(404).json({ error: 'Session not found' });

    const formatted = session.questions.map((q, i) => `
      ${i + 1}. Q: ${q.question}
      Difficulty: ${q.difficulty}
      User Answer: ${q.answer || 'Not answered'}
      Feedback:
      - Strengths: ${q.feedback?.strengths || 'N/A'}
      - Improvements: ${q.feedback?.improvements || 'N/A'}
      - Rating: ${q.feedback?.rating ?? 0}
      `).join('\n\n');

      const summaryPrompt = `
      You are an AI Interview Coach.
      Summarize the candidate's mock interview session using the following Q&A and feedback:

      ${formatted}

      Now perform two tasks:

      1. Write a short performance summary (3-4 lines) based on the overall strengths and areas of improvement.
      2. Calculate a SkillScore (0–100) using weighted average:

      👉 SkillScore Calculation:
      - Use a weighted average based on difficulty:
          Easy → weight = 1
          Medium → weight = 2
          Hard → weight = 3
      - If a question is not answered or has no rating, take its rating as 0.
      - Use formula:  
        Weighted SkillScore = (Σ rating × weight) ÷ (Σ weights) × 10

      ⚠️ Return ONLY JSON in the following format:
      {
        "summary": "...",
        "skillScore": 83
      }
      `;


    const response = await axios.post(
      `${process.env.OPENROUTER_BASE_URL}/chat/completions`,
      {
        model: process.env.OPENROUTER_MODEL,
        messages: [{ role: "user", content: summaryPrompt }],
        stream: false,
      },
      { headers: openRouterHeaders }
    );

    const content = response.data.choices[0].message.content;
    const clean = content.replace(/```(?:json)?|```/g, '').trim();
    const parsed = JSON.parse(clean);

    session.summary = parsed.summary;
    session.skillScore = parsed.skillScore;
    await session.save();
    console.log(session.skillScore);
    console.log(session);
    res.json({ summary: parsed.summary, skillScore: parsed.skillScore });

  } catch (error) {
    console.error("OpenRouter Error (Summary):", error.response?.data || error.message || error);
    res.status(500).json({ error: "Failed to generate summary" });
  }
};
