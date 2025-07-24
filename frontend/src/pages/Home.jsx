import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';

const Home = () => {
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false); // loader state
  const navigate = useNavigate();

  const handleStartInterview = async () => {
    const token = localStorage.getItem('token');
    if (!token) return alert('You must be logged in.');

    setLoading(true); // start loading

    try {
      const res = await axios.post(
        'http://localhost:5000/api/interview/start',
        {
          role: role || 'Frontend Developer',
          numQuestions: 5
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const { sessionId, questions } = res.data;
      localStorage.setItem('questions', JSON.stringify(questions));
      navigate(`/interview/${sessionId}`);
    } catch (error) {
      console.error('Error starting interview:', error);
      alert('Failed to start interview');
    } finally {
      setLoading(false); // stop loading even if it fails
    }
  };

  return (
    <div className="min-h-screen bg-[#101c24] pb-8">
      <Header />
      <h1 className="text-3xl text-center text-white font-bold mt-12">Ace your Next interview</h1>
      <div className="text-center items-center flex justify-center">
        <h3 className="text-sm max-w-3xl text-center text-white my-6">
          Practice with AI-powered mock interviews tailored to your specific job role. Get instant feedback and improve your performance.
        </h3>
      </div>
      <div className="mb-4 text-center">
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="p-2 rounded bg-[#28344c] w-full max-w-sm"
        >
          <option value="">Select Job Role</option>
          <option value="Frontend Developer">Frontend Developer</option>
          <option value="Backend Developer">Backend Developer</option>
          <option value="Full Stack Developer">Full Stack Developer</option>
          <option value="Data Scientist">Data Scientist</option>
        </select>
      </div>
      <div className="text-center">
        <button
          onClick={handleStartInterview}
          disabled={loading}
          className="bg-[#369eff] text-[#0f1924] rounded-xl p-3 text-sm font-bold hover:bg-blue-300 disabled:opacity-60"
        >
          {loading ? 'Starting Interview.....' : 'Start Interview'}
        </button>
      </div>
    </div>
  );
};

export default Home;
