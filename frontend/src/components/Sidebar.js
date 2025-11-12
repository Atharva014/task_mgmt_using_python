import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckSquare, Calendar, Plus, User, Users, LogOut } from 'lucide-react';
import { authService } from '../services/authService';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', icon: CheckSquare, label: 'Dashboard' },
    { path: '/tasks', icon: Calendar, label: 'My Tasks' },
    { path: '/create-task', icon: Plus, label: 'Create Task' },
    { path: '/team', icon: Users, label: 'Team' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="w-64 bg-gray-800 text-white h-screen p-4 flex flex-col">
      <h1 className="text-2xl font-bold mb-8">TaskFlow</h1>
      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full text-left p-3 rounded flex items-center gap-3 transition ${
                isActive ? 'bg-gray-700' : 'hover:bg-gray-700'
              }`}
            >
              <Icon size={20} /> {item.label}
            </button>
          );
        })}
      </nav>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-red-400 hover:text-red-300 p-3"
      >
        <LogOut size={20} /> Logout
      </button>
    </div>
  );
};

export default Sidebar;