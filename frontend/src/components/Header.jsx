import React from 'react';
import 'boxicons';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  const openExternal = (url) => {
    window.open(url, '_blank');
  };

  return (
    <header className="bg-[#101c24] text-white py-4 px-6 shadow-md border-b border-white flex justify-between">
      <div className="flex justify-center items-center">
        <div className="pt-2 px-2">
          <box-icon name="cube" type="solid" flip="horizontal" color="#ffffff" size="sm"></box-icon>
        </div>
        <div className="font-bold text-lg">InterviewAI</div>
      </div>

      <div className="space-x-6 flex justify-center">
        <button onClick={() => handleNavigate('/home')} className="text-sm font-semibold">
          Home
        </button>
        <button
          onClick={() => openExternal('https://codinewbie.github.io/portfolio/')}
          className="text-sm font-semibold"
        >
          Developer
        </button>
        <button
          onClick={() => openExternal('https://github.com/Codinewbie')}
          className="text-sm font-semibold"
        >
          GitHub
        </button>
        <button
          onClick={() => {
            localStorage.clear();        // Clear all local storage
            handleNavigate('/');         // Redirect to login or signup page
          }}
          className="bg-[#369eff] text-[#0f1924] rounded-xl px-3 text-sm font-bold"
        >
          Sign Up
        </button>

      </div>
    </header>
  );
};

export default Header;
