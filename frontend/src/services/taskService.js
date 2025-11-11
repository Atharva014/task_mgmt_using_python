import api from './api';

export const taskService = {
  // Get all tasks
  getAllTasks: async (params) => {
    const response = await api.get('/tasks/', { params });
    return response.data;
  },

  // Get single task
  getTask: async (id) => {
    const response = await api.get(`/tasks/${id}/`);
    return response.data;
  },

  // Create task
  createTask: async (taskData) => {
    const response = await api.post('/tasks/', taskData);
    return response.data;
  },

  // Update task
  updateTask: async (id, taskData) => {
    const response = await api.put(`/tasks/${id}/`, taskData);
    return response.data;
  },

  // Delete task
  deleteTask: async (id) => {
    await api.delete(`/tasks/${id}/`);
  },

  // Get task statistics
  getStats: async () => {
    const tasks = await taskService.getAllTasks();
    return {
      total: tasks.length,
      todo: tasks.filter(t => t.status === 'todo').length,
      inProgress: tasks.filter(t => t.status === 'in_progress').length,
      completed: tasks.filter(t => t.status === 'completed').length,
    };
  },
};