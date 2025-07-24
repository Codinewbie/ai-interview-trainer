import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";

const TIMER_MAP = {
  Easy: 60,
  Medium: 120,
  Hard: 180,
};

const Interview = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const questions = JSON.parse(localStorage.getItem("questions") || "[]");
  const token = localStorage.getItem("token");

  const [userAnswers, setUserAnswers] = useState(Array(questions.length).fill(""));
  const [feedbacks, setFeedbacks] = useState(Array(questions.length).fill(null));
  const [timeLeft, setTimeLeft] = useState(questions.map((q) => TIMER_MAP[q.difficulty] || 60));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const timerRef = useRef(null);

  useEffect(() => {
    localStorage.removeItem("interviewQA");
  }, []);

  useEffect(() => {
    if (feedbacks[currentQuestionIndex] || currentQuestionIndex >= questions.length) return;

    const currentTime = timeLeft[currentQuestionIndex];

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const updated = [...prev];
        if (updated[currentQuestionIndex] > 0) {
          updated[currentQuestionIndex] -= 1;
        } else {
          clearInterval(timerRef.current);
          handleAutoSubmit(currentQuestionIndex);
        }
        return updated;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestionIndex]);

  const handleAnswerChange = (index, value) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[index] = value;
    setUserAnswers(updatedAnswers);
  };

  const handleSubmit = async (index) => {
    if (feedbacks[index] || submitting) return;

    clearInterval(timerRef.current);
    setSubmitting(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/interview/answer",
        {
          sessionId,
          questionIndex: index,
          userAnswer: userAnswers[index],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedFeedbacks = [...feedbacks];
      updatedFeedbacks[index] = res.data.feedback;
      setFeedbacks(updatedFeedbacks);

      const stored = JSON.parse(localStorage.getItem("interviewQA")) || [];
      const questionData = {
        question: questions[index].question,
        answer: userAnswers[index],
        feedback: res.data.feedback,
      };
      stored[index] = questionData;
      localStorage.setItem("interviewQA", JSON.stringify(stored));

      if (index + 1 < questions.length) {
        setCurrentQuestionIndex(index + 1);
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAutoSubmit = async (index) => {
    if (feedbacks[index]) return;
    try {
      await handleSubmit(index);
    } catch (err) {
      console.error("Auto-submit failed:", err);
    }
  };

  return (
    <div className="bg-[#101c24]">
      <Header />
      <div className="max-w-5xl mx-auto p-4 space-y-8">
        <h1 className="text-3xl text-white font-bold mb-6">Interview Questions</h1>

        {questions.map((q, index) => (
          <div key={index} className="rounded-lg pt-6 relative">
            <h2 className="text-lg text-white font-semibold mb-2">Question {index + 1}</h2>
            <p className="text-white">{q.question}</p>
            <p className="text-sm text-gray-500 mb-3">
              Difficulty: {q.difficulty} | Skill: {q.skillTag}
            </p>

            {index === currentQuestionIndex && !feedbacks[index] && (
              <>
                <div className="absolute top-4 right-6 rounded py-1 px-2 bg-[#172636] text-white font-semibold">
                  {timeLeft[index] % 60}s
                </div>
                <div className="absolute top-4 right-20 rounded py-1 px-2 bg-[#172636] text-white font-semibold">
                  {Math.floor(timeLeft[index] / 60)}m
                </div>
              </>
            )}

            <textarea
              rows={4}
              className="w-full text-white text-sm p-3 bg-[#172636] border-[#2e4f6b] rounded mb-4"
              placeholder="Type your answer..."
              value={userAnswers[index]}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
              disabled={feedbacks[index] !== null || submitting}
            />

            {index === currentQuestionIndex &&
              userAnswers[index].trim() !== "" &&
              !feedbacks[index] && (
                <button
                  onClick={() => handleSubmit(index)}
                  disabled={submitting}
                  className="px-3 py-2 rounded-lg text-[#0f1924] bg-[#369eff] text-sm font-bold hover:bg-blue-700 disabled:opacity-60"
                >
                  {submitting ? "Submitting..." : "Submit Answer"}
                </button>
              )}

            {feedbacks[index] && (
              <div className="rounded">
                <h3 className="font-semibold text-md mb-2 text-white">AI Feedback</h3>
                <p className="text-white text-sm pb-1">
                  <strong className="text-[#8cadcf]">Strengths:</strong> {feedbacks[index].strengths}
                </p>
                <p className="text-white text-sm pb-1">
                  <strong className="text-[#8cadcf]">Improvements:</strong> {feedbacks[index].improvements}
                </p>
                <p className="text-white text-sm pb-1">
                  <strong className="text-[#8cadcf]">Rating:</strong> {feedbacks[index].rating} / 10
                </p>
              </div>
            )}
          </div>
        ))}

        <div className="text-right my-6">
          <button
            onClick={() => navigate(`/summary/${sessionId}`, { state: { sessionId, token } })}
            className="bg-[#172636] hover:rounded-3xl text-[#8cadcf] px-4 font-bold py-3 rounded-lg"
          >
            Finish Interview
          </button>
        </div>
      </div>
    </div>
  );
};

export default Interview;
