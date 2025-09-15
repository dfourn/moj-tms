import request from 'supertest';
import { app } from '../../main/app';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Task Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /tasks', () => {
    it('should render task list page with tasks', async () => {
      const mockTasks = [
        {
          id: 1,
          title: 'Test Task',
          description: 'Test Description',
          status: 'TODO',
          dueDate: '2025-01-15T10:00:00',
          createdAt: '2025-01-01T10:00:00',
          updatedAt: '2025-01-01T10:00:00'
        }
      ];

      mockedAxios.get.mockResolvedValue({ data: mockTasks });

      const response = await request(app)
        .get('/tasks')
        .expect(200);

      expect(response.text).toContain('Task Management System');
      expect(response.text).toContain('Test Task');
      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:8080/api/tasks');
    });

    it('should handle API error gracefully', async () => {
      mockedAxios.get.mockRejectedValue(new Error('API Error'));

      const response = await request(app)
        .get('/tasks')
        .expect(200);

      expect(response.text).toContain('Task Management System');
      expect(response.text).toContain('Unable to load tasks');
    });
  });

  describe('GET /tasks/new', () => {
    it('should render new task form', async () => {
      const response = await request(app)
        .get('/tasks/new')
        .expect(200);

      expect(response.text).toContain('Create New Task');
      expect(response.text).toContain('Title');
      expect(response.text).toContain('Description');
      expect(response.text).toContain('Status');
      expect(response.text).toContain('Due Date');
    });
  });

  describe('POST /tasks', () => {
    it('should create task and redirect to list', async () => {
      mockedAxios.post.mockResolvedValue({ data: { id: 1 } });

      const taskData = {
        title: 'New Task',
        description: 'New Description',
        status: 'TODO',
        dueDate: '2025-01-15T10:00:00'
      };

      const response = await request(app)
        .post('/tasks')
        .send(taskData)
        .expect(302);

      expect(response.headers.location).toBe('/tasks');
      expect(mockedAxios.post).toHaveBeenCalledWith('http://localhost:8080/api/tasks', taskData);
    });

    it('should handle creation error and re-render form', async () => {
      mockedAxios.post.mockRejectedValue(new Error('Creation failed'));

      const taskData = {
        title: 'New Task',
        description: 'New Description',
        status: 'TODO',
        dueDate: '2025-01-15T10:00:00'
      };

      const response = await request(app)
        .post('/tasks')
        .send(taskData)
        .expect(200);

      expect(response.text).toContain('Create New Task');
      expect(response.text).toContain('Unable to create task');
    });
  });

  describe('GET /tasks/:id', () => {
    it('should render task details', async () => {
      const mockTask = {
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        status: 'TODO',
        dueDate: '2025-01-15T10:00:00',
        createdAt: '2025-01-01T10:00:00',
        updatedAt: '2025-01-01T10:00:00'
      };

      mockedAxios.get.mockResolvedValue({ data: mockTask });

      const response = await request(app)
        .get('/tasks/1')
        .expect(200);

      expect(response.text).toContain('Test Task');
      expect(response.text).toContain('Test Description');
      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:8080/api/tasks/1');
    });

    it('should render 404 for non-existent task', async () => {
      const error = new Error('Not found');
      (error as any).response = { status: 404 };
      mockedAxios.get.mockRejectedValue(error);

      const response = await request(app)
        .get('/tasks/999')
        .expect(404);

      expect(response.text).toContain('Task Not Found');
    });
  });

  describe('GET /tasks/:id/edit', () => {
    it('should render edit form with task data', async () => {
      const mockTask = {
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        status: 'TODO',
        dueDate: '2025-01-15T10:00:00',
        createdAt: '2025-01-01T10:00:00',
        updatedAt: '2025-01-01T10:00:00'
      };

      mockedAxios.get.mockResolvedValue({ data: mockTask });

      const response = await request(app)
        .get('/tasks/1/edit')
        .expect(200);

      expect(response.text).toContain('Edit Task');
      expect(response.text).toContain('Test Task');
      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:8080/api/tasks/1');
    });
  });

  describe('POST /tasks/:id', () => {
    it('should update task and redirect to details', async () => {
      mockedAxios.put.mockResolvedValue({ data: { id: 1 } });

      const updateData = {
        title: 'Updated Task',
        description: 'Updated Description',
        status: 'IN_PROGRESS',
        dueDate: '2025-01-16T10:00:00'
      };

      const response = await request(app)
        .post('/tasks/1')
        .send(updateData)
        .expect(302);

      expect(response.headers.location).toBe('/tasks/1');
      expect(mockedAxios.put).toHaveBeenCalledWith('http://localhost:8080/api/tasks/1', updateData);
    });
  });

  describe('POST /tasks/:id/status', () => {
    it('should update task status and redirect', async () => {
      mockedAxios.patch.mockResolvedValue({ data: { id: 1 } });

      const response = await request(app)
        .post('/tasks/1/status')
        .send({ status: 'COMPLETED' })
        .expect(302);

      expect(response.headers.location).toBe('/tasks/1');
      expect(mockedAxios.patch).toHaveBeenCalledWith(
        'http://localhost:8080/api/tasks/1/status',
        null,
        { params: { status: 'COMPLETED' } }
      );
    });
  });

  describe('POST /tasks/:id/delete', () => {
    it('should delete task and redirect to list', async () => {
      mockedAxios.delete.mockResolvedValue({ data: {} });

      const response = await request(app)
        .post('/tasks/1/delete')
        .expect(302);

      expect(response.headers.location).toBe('/tasks');
      expect(mockedAxios.delete).toHaveBeenCalledWith('http://localhost:8080/api/tasks/1');
    });
  });
});