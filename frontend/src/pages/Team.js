import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import api from '../services/api';
import { Mail, Calendar } from 'lucide-react';

const Team = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(
        (user) =>
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (user.first_name && user.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.last_name && user.last_name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  const loadUsers = async () => {
    try {
      const response = await api.get('/users/');
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (username) => {
    return username.charAt(0).toUpperCase();
  };

  const getAvatarColor = (index) => {
    const colors = [
      'bg-purple-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-pink-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-indigo-500',
      'bg-teal-500',
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header title="Team Members" />
        <div className="p-6">
          {/* Search Bar */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <input
              type="text"
              placeholder="Search team members by name, username, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Team Stats */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">{users.length}</h3>
                <p className="text-gray-600">Total Team Members</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Active members working on tasks</p>
              </div>
            </div>
          </div>

          {/* Team Members Grid */}
          {filteredUsers.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-600">
                {searchTerm ? 'No team members found matching your search.' : 'No team members yet.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((user, index) => (
                <div
                  key={user.id}
                  className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={`w-16 h-16 ${getAvatarColor(index)} rounded-full flex items-center justify-center text-white text-2xl font-bold`}
                    >
                      {getInitials(user.username)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">
                        {user.first_name && user.last_name
                          ? `${user.first_name} ${user.last_name}`
                          : user.username}
                      </h3>
                      <p className="text-sm text-gray-600">@{user.username}</p>
                    </div>
                  </div>

                  <div className="space-y-2 border-t pt-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail size={16} />
                      <span className="truncate">{user.email}</span>
                    </div>
                    {user.date_joined && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={16} />
                        <span>Joined {new Date(user.date_joined).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Role</span>
                      <span className="font-semibold text-blue-600">
                        {user.is_staff ? 'Admin' : 'Member'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Team;