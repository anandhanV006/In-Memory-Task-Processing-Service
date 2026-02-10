const request = require('supertest');
const app = require('../app');
const taskService = require('../services/taskService');

describe('Task API Endpoints', () => {
  beforeEach(() => {
    taskService.clearAll();
  });

  describe('POST /tasks', () => {
    test('should create a task', async () => {
      const response = await request(app)
        .post('/tasks')
        .send({
          title: 'New Task',
          description: 'Task description',
          priority: 'high'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('New Task');
    });

    test('should return 400 without title', async () => {
      const response = await request(app)
        .post('/tasks')
        .send({ description: 'No title' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('should return 400 for invalid status', async () => {
      const response = await request(app)
        .post('/tasks')
        .send({
          title: 'Test',
          status: 'invalid'
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /tasks', () => {
    test('should get all tasks', async () => {
      await request(app).post('/tasks').send({ title: 'Task 1' });
      await request(app).post('/tasks').send({ title: 'Task 2' });

      const response = await request(app).get('/tasks');

      expect(response.status).toBe(200);
      expect(response.body.count).toBe(2);
    });

    test('should filter by status', async () => {
      await request(app).post('/tasks').send({ title: 'Task 1', status: 'todo' });
      await request(app).post('/tasks').send({ title: 'Task 2', status: 'done' });

      const response = await request(app).get('/tasks?status=todo');

      expect(response.status).toBe(200);
      expect(response.body.count).toBe(1);
    });

    test('should filter by priority', async () => {
      await request(app).post('/tasks').send({ title: 'Task 1', priority: 'high' });
      await request(app).post('/tasks').send({ title: 'Task 2', priority: 'low' });

      const response = await request(app).get('/tasks?priority=high');

      expect(response.status).toBe(200);
      expect(response.body.count).toBe(1);
    });

    test('should sort by createdAt', async () => {
      await request(app).post('/tasks').send({ title: 'First' });
      await request(app).post('/tasks').send({ title: 'Second' });

      const response = await request(app)
        .get('/tasks?sortBy=createdAt&sortOrder=asc');

      expect(response.status).toBe(200);
      expect(response.body.data[0].title).toBe('First');
    });
  });

  describe('GET /tasks/:id', () => {
    test('should get task by id', async () => {
      const createRes = await request(app)
        .post('/tasks')
        .send({ title: 'Test' });

      const taskId = createRes.body.data.id;

      const response = await request(app).get(`/tasks/${taskId}`);

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBe(taskId);
    });

    test('should return 404 for non-existent task', async () => {
      const response = await request(app)
        .get('/tasks/00000000-0000-0000-0000-000000000000');

      expect(response.status).toBe(404);
    });

    test('should return 400 for invalid id format', async () => {
      const response = await request(app).get('/tasks/invalid-id');

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /tasks/:id', () => {
    test('should update task', async () => {
      const createRes = await request(app)
        .post('/tasks')
        .send({ title: 'Original' });

      const taskId = createRes.body.data.id;

      const response = await request(app)
        .put(`/tasks/${taskId}`)
        .send({ title: 'Updated', status: 'done' });

      expect(response.status).toBe(200);
      expect(response.body.data.title).toBe('Updated');
      expect(response.body.data.status).toBe('done');
    });

    test('should return 404 for non-existent task', async () => {
      const response = await request(app)
        .put('/tasks/00000000-0000-0000-0000-000000000000')
        .send({ title: 'Updated' });

      expect(response.status).toBe(404);
    });

    test('should return 400 without fields', async () => {
      const createRes = await request(app)
        .post('/tasks')
        .send({ title: 'Test' });

      const taskId = createRes.body.data.id;

      const response = await request(app)
        .put(`/tasks/${taskId}`)
        .send({});

      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /tasks/:id', () => {
    test('should soft delete task', async () => {
      const createRes = await request(app)
        .post('/tasks')
        .send({ title: 'To Delete' });

      const taskId = createRes.body.data.id;

      const response = await request(app).delete(`/tasks/${taskId}`);

      expect(response.status).toBe(200);

      // Verify it's gone
      const getRes = await request(app).get(`/tasks/${taskId}`);
      expect(getRes.status).toBe(404);
    });

    test('should hard delete task', async () => {
      const createRes = await request(app)
        .post('/tasks')
        .send({ title: 'To Delete' });

      const taskId = createRes.body.data.id;

      const response = await request(app)
        .delete(`/tasks/${taskId}?hard=true`);

      expect(response.status).toBe(200);
      expect(response.body.message).toContain('permanently');
    });
  });

  describe('GET /tasks/stats', () => {
    test('should get statistics', async () => {
      await request(app).post('/tasks').send({ title: 'Task 1', status: 'todo' });
      await request(app).post('/tasks').send({ title: 'Task 2', status: 'done' });

      const response = await request(app).get('/tasks/stats');

      expect(response.status).toBe(200);
      expect(response.body.data.total).toBe(2);
      expect(response.body.data.byStatus.todo).toBe(1);
      expect(response.body.data.byStatus.done).toBe(1);
    });
  });

  describe('GET /health', () => {
    test('should return health status', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('UP');
    });
  });
});
