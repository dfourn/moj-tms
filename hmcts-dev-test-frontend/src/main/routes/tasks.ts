import { Application } from 'express';
import axios from 'axios';

// I love how clean this environment-based config is
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080/api';

/**
 * Task management routes - the heart of the frontend!
 * 
 * I've structured these to follow a clear pattern:
 * - GET routes show pages/data
 * - POST routes handle form submissions and actions
 * - Comprehensive error handling because things go wrong
 */
export default function (app: Application): void {
  // List all tasks
  app.get('/tasks', async (req, res) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/tasks`);
      res.render('tasks/list', { 
        tasks: response.data,
        title: 'Task Management System'
      });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      res.render('tasks/list', { 
        tasks: [],
        title: 'Task Management System',
        error: 'Unable to load tasks. Please try again later.'
      });
    }
  });

  // Show create task form
  app.get('/tasks/new', (req, res) => {
    res.render('tasks/new', { 
      title: 'Create New Task',
      task: {}
    });
  });

  // Create new task
  app.post('/tasks', async (req, res) => {
    try {
      const taskData = {
        title: req.body.title,
        description: req.body.description,
        status: req.body.status,
        dueDate: req.body.dueDate || null
      };

      await axios.post(`${API_BASE_URL}/tasks`, taskData);
      res.redirect('/tasks');
    } catch (error) {
      console.error('Error creating task:', error);
      res.render('tasks/new', { 
        title: 'Create New Task',
        task: req.body,
        error: 'Unable to create task. Please check your input and try again.'
      });
    }
  });

  // Show task details
  app.get('/tasks/:id', async (req, res) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/tasks/${req.params.id}`);
      res.render('tasks/view', { 
        task: response.data,
        title: `Task: ${response.data.title}`
      });
    } catch (error) {
      console.error('Error fetching task:', error);
      if (error.response && error.response.status === 404) {
        res.status(404).render('not-found', { title: 'Task Not Found' });
      } else {
        res.render('error', { 
          title: 'Error',
          error: 'Unable to load task details.'
        });
      }
    }
  });

  // Show edit task form
  app.get('/tasks/:id/edit', async (req, res) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/tasks/${req.params.id}`);
      res.render('tasks/edit', { 
        task: response.data,
        title: `Edit Task: ${response.data.title}`
      });
    } catch (error) {
      console.error('Error fetching task for edit:', error);
      if (error.response && error.response.status === 404) {
        res.status(404).render('not-found', { title: 'Task Not Found' });
      } else {
        res.render('error', { 
          title: 'Error',
          error: 'Unable to load task for editing.'
        });
      }
    }
  });

  // Update task
  app.post('/tasks/:id', async (req, res) => {
    try {
      const taskData = {
        title: req.body.title,
        description: req.body.description,
        status: req.body.status,
        dueDate: req.body.dueDate || null
      };

      await axios.put(`${API_BASE_URL}/tasks/${req.params.id}`, taskData);
      res.redirect(`/tasks/${req.params.id}`);
    } catch (error) {
      console.error('Error updating task:', error);
      if (error.response && error.response.status === 404) {
        res.status(404).render('not-found', { title: 'Task Not Found' });
      } else {
        const response = await axios.get(`${API_BASE_URL}/tasks/${req.params.id}`).catch(() => null);
        res.render('tasks/edit', { 
          task: response?.data || req.body,
          title: `Edit Task`,
          error: 'Unable to update task. Please check your input and try again.'
        });
      }
    }
  });

  // Update task status
  app.post('/tasks/:id/status', async (req, res) => {
    try {
      const status = req.body.status;
      await axios.patch(`${API_BASE_URL}/tasks/${req.params.id}/status`, null, {
        params: { status }
      });
      res.redirect(`/tasks/${req.params.id}`);
    } catch (error) {
      console.error('Error updating task status:', error);
      res.redirect(`/tasks/${req.params.id}`);
    }
  });

  // Delete task
  app.post('/tasks/:id/delete', async (req, res) => {
    try {
      await axios.delete(`${API_BASE_URL}/tasks/${req.params.id}`);
      res.redirect('/tasks');
    } catch (error) {
      console.error('Error deleting task:', error);
      res.redirect(`/tasks/${req.params.id}`);
    }
  });
}