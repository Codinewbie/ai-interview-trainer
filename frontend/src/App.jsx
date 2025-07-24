// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Interview from './pages/Interview';
import History from './pages/History';
import InterviewSumarry from './pages/InterviewSumarry';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/" element={<Login />} />

      {/* Protected routes */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/summary/:sessionId"
        element={
          <ProtectedRoute>
            <InterviewSumarry />
          </ProtectedRoute>
        }
      />
      <Route
        path="/interview/:sessionId"
        element={
          <ProtectedRoute>
            <Interview />
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
