import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import TaskList from './pages/TaskList';
import CreateTask from './pages/CreateTask';
import EditTask from './pages/EditTask';
import Profile from './pages/Profile';
import Team from './pages/Team';
import { authService } from './services/authService';

const ProtectedRoute = ({ children }) => {
  return authService.isAuthenticated() ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <TaskList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-task"
          element={
            <ProtectedRoute>
              <CreateTask />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-task/:id"
          element={
            <ProtectedRoute>
              <EditTask />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/team"
          element={
            <ProtectedRoute>
              <Team />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;