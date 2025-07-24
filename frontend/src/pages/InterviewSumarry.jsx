import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';

const InterviewSumarry = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [summary, setSummary] = useState('');
  const [skillScore, setSkillScore] = useState(null);
  const [qaData, setQaData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false); // ✅ PDF loading state

  useEffect(() => {
    const storedQA = JSON.parse(localStorage.getItem('interviewQA')) || [];
    setQaData(storedQA);

    const fetchSummary = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/interview/summary`,
          { sessionId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSummary(response.data.summary);
        setSkillScore(response.data.skillScore);
      } catch (error) {
        console.error('Error fetching summary:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummary();
  }, [sessionId, token]);

  const handleGoHome = () => {
    localStorage.removeItem('interviewQA');
    navigate('/');
  };


  // ✅ Export as PDF Handler
  const handleExportPdf = async () => {
    localStorage.clear(); 
    setIsExporting(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/interview/export-pdf`,
        { sessionId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'blob', // Important: handle binary response
        }
      );

      // ✅ Trigger browser download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'interview-summary.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#101c24]">
        <div className="text-xl font-medium text-gray-600 animate-pulse">
          Loading Session Summary.....
        </div>
      </div>
    );
  }

  return (
    <div className = "bg-[#101c24]  min-h-screen">
    <Header/>
    <div className="max-w-5xl mx-auto p-6 ">
      <h1 className="text-4xl text-white font-bold mb-4">Interview Summary</h1>
      <div className="text-[#4c647c] mb-12">Review your performance and feedback from the AI interview.</div>
      

      
        {qaData.map((qa, index) => (
          <div className="">
          <h2 className="text-2xl text-white font-bold mb-4">Question-wise Feedback</h2>
            <div key={index} className=" pb-4 mt-4">
              <p className="text-white"><strong>Q{index + 1}:</strong> {qa.question}</p>
              <p className="mt-2 text-[#4c647c]"><strong>Submitted Answer:</strong> {qa.answer}</p>
              <p className="mt-2 text-[#4c647c]"><strong>Strengths:</strong> {qa.feedback?.strengths}</p>
              <p className="mt-1 text-[#4c647c]"><strong>Improvements:</strong> {qa.feedback?.improvements}</p>
              <p className="mt-1 text-[#4c647c]"><strong>Rating:</strong> {qa.feedback?.rating}/10</p>
            </div>
          </div>
        ))}
  
      <div className=" py-6 mb-6">
        <p className="text-md font-medium text-white">Overall performance</p>
        <p className="text-gray-700 mt-2">{summary}</p>
        <p className="text-md font-semibold mt-4 text-white">
         Skill Score: <span className="text-blue-600 text-md">{skillScore } / 100</span>
        </p>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleGoHome}
          className="px-6 py-2 bg-[#4c647c] text-sm font-semibold text-white rounded-xl hover:bg-[#21364a]"
        >
          Back to Home
        </button>

        <button
          onClick={handleExportPdf}
          disabled={isExporting}
          className={`px-6 py-2 rounded-xl ${
            isExporting ? 'bg-gray-400' : 'bg-[#21364a] hover:bg-[#4c647c]'
          } text-white text-sm font-semibold`}
        >
          {isExporting ? 'Exporting PDF...' : 'Export as PDF'}
        </button>
      </div>
    </div>
    </div>
  );
};

export default InterviewSumarry;
