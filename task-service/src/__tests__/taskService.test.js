const taskService = require('../services/taskService');

describe('Task Service', () => {
  beforeEach(() => {
    // Clear all tasks before each test
    taskService.clearAll();
  });

  test('should create a task with defaults', () => {
    const task = taskService.createNewTask({ title: 'Test Task' });

    expect(task).toHaveProperty('id');
    expect(task.title).toBe('Test Task');
    expect(task.status).toBe('todo');
    expect(task.priority).toBe('medium');
    expect(task.isDeleted).toBe(false);
  });

  test('should create task with custom values', () => {
    const taskData = {
      title: 'Important Task',
      description: 'Do this now',
      status: 'in_progress',
      priority: 'high'
    };

    const task = taskService.createNewTask(taskData);

    expect(task.title).toBe('Important Task');
    expect(task.description).toBe('Do this now');
    expect(task.status).toBe('in_progress');
    expect(task.priority).toBe('high');
  });

  test('should fetch all tasks', () => {
    taskService.createNewTask({ title: 'Task 1' });
    taskService.createNewTask({ title: 'Task 2' });
    
    const tasks = taskService.fetchTasks();
    
    expect(tasks.length).toBe(2);
  });

  test('should filter tasks by status', () => {
    taskService.createNewTask({ title: 'Task 1', status: 'todo' });
    taskService.createNewTask({ title: 'Task 2', status: 'done' });
    
    const tasks = taskService.fetchTasks({ status: 'todo' });
    
    expect(tasks.length).toBe(1);
    expect(tasks[0].title).toBe('Task 1');
  });

  test('should filter tasks by priority', () => {
    taskService.createNewTask({ title: 'Task 1', priority: 'low' });
    taskService.createNewTask({ title: 'Task 2', priority: 'high' });
    
    const tasks = taskService.fetchTasks({ priority: 'high' });
    
    expect(tasks.length).toBe(1);
    expect(tasks[0].title).toBe('Task 2');
  });

  test('should sort tasks by createdAt desc', () => {
    const task1 = taskService.createNewTask({ title: 'First' });
    const task2 = taskService.createNewTask({ title: 'Second' });
    
    const tasks = taskService.fetchTasks({ sortBy: 'createdAt', sortOrder: 'desc' });
    
    expect(tasks[0].title).toBe('Second');
    expect(tasks[1].title).toBe('First');
  });

  test('should get task by id', () => {
    const created = taskService.createNewTask({ title: 'Test' });
    const found = taskService.getTask(created.id);
    
    expect(found).not.toBeNull();
    expect(found.id).toBe(created.id);
  });

  test('should return null for non-existent task', () => {
    const task = taskService.getTask('fake-id');
    expect(task).toBeNull();
  });

  test('should update task', () => {
    const created = taskService.createNewTask({ title: 'Original' });
    
    const updated = taskService.modifyTask(created.id, {
      title: 'Updated',
      status: 'done'
    });
    
    expect(updated.title).toBe('Updated');
    expect(updated.status).toBe('done');
  });

  test('should soft delete task', () => {
    const task = taskService.createNewTask({ title: 'Test' });
    
    taskService.removeTask(task.id, false);
    
    const found = taskService.getTask(task.id);
    expect(found).toBeNull();
  });

  test('should hard delete task', () => {
    const task = taskService.createNewTask({ title: 'Test' });
    
    taskService.removeTask(task.id, true);
    
    const tasks = taskService.fetchTasks();
    expect(tasks.length).toBe(0);
  });

  test('should get statistics', () => {
    taskService.createNewTask({ title: 'Task 1', status: 'todo', priority: 'high' });
    taskService.createNewTask({ title: 'Task 2', status: 'done', priority: 'low' });
    
    const stats = taskService.getTaskStats();
    
    expect(stats.total).toBe(2);
    expect(stats.byStatus.todo).toBe(1);
    expect(stats.byStatus.done).toBe(1);
    expect(stats.byPriority.high).toBe(1);
    expect(stats.byPriority.low).toBe(1);
  });
});
