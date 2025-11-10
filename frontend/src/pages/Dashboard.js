import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>
      <div className="p-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 mt-20">
          Welcome to TaskFlow! 🎉
        </h2>
        <p className="text-center text-gray-600 mt-4">
          Authentication is working! We'll build the full dashboard in Part 2.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;