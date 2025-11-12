import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Header = ({ title }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const response = await api.get('/users/me/');
      setUser(response.data);
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const getInitials = (username) => {
    return username ? username.charAt(0).toUpperCase() : 'U';
  };

  const getDisplayName = () => {
    if (!user) return 'User';
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return user.username;
  };

  return (
    <div className="bg-white shadow-sm p-4 flex justify-between items-center">
      <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
          {user ? getInitials(user.username) : 'U'}
        </div>
        <span className="text-gray-700 font-medium">{getDisplayName()}</span>
      </div>
    </div>
  );
};

export default Header;