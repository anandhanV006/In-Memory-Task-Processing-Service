const { v4: uuidv4 } = require('uuid');
const taskStore = require('../store/taskStore');

// Create a new task
function createNewTask(taskData) {
  // Build task object with defaults
  const newTask = {
    id: uuidv4(),
    title: taskData.title,
    description: taskData.description || '',
    status: taskData.status || 'todo',
    priority: taskData.priority || 'medium',
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false
  };

  // Save to store
  taskStore.addTask(newTask);
  
  return newTask;
}

// Get all tasks with filters
function fetchTasks(filters = {}) {
  // Start with active tasks only
  let tasks = taskStore.getActiveTasks();

  // Filter by status if provided
  if (filters.status) {
    tasks = tasks.filter(t => t.status === filters.status);
  }

  // Filter by priority if provided
  if (filters.priority) {
    tasks = tasks.filter(t => t.priority === filters.priority);
  }

  // Sort if requested
  if (filters.sortBy === 'createdAt') {
    const order = filters.sortOrder || 'desc';
    tasks = sortTasksByDate(tasks, order);
  }

  return tasks;
}

// Get single task by id
function getTask(taskId) {
  const task = taskStore.findTaskById(taskId);
  
  // Don't return deleted tasks
  if (!task || task.isDeleted) {
    return null;
  }

  return task;
}

// Update task
function modifyTask(taskId, updates) {
  const task = getTask(taskId);
  
  if (!task) {
    return null;
  }

  // Only allow certain fields to update
  const allowedFields = ['title', 'description', 'status', 'priority'];
  const filteredUpdates = {};
  
  allowedFields.forEach(field => {
    if (updates[field] !== undefined) {
      filteredUpdates[field] = updates[field];
    }
  });

  return taskStore.updateTaskById(taskId, filteredUpdates);
}

// Delete task
function removeTask(taskId, hardDelete = false) {
  const task = getTask(taskId);
  
  if (!task) {
    return false;
  }

  if (hardDelete) {
    return taskStore.deleteTaskById(taskId);
  } else {
    return taskStore.softDeleteTask(taskId) !== null;
  }
}

// Get task statistics
function getTaskStats() {
  const activeTasks = taskStore.getActiveTasks();
  
  // Count by status
  const statusCounts = {
    todo: 0,
    in_progress: 0,
    done: 0
  };

  // Count by priority
  const priorityCounts = {
    low: 0,
    medium: 0,
    high: 0
  };

  activeTasks.forEach(task => {
    statusCounts[task.status]++;
    priorityCounts[task.priority]++;
  });

  return {
    total: activeTasks.length,
    byStatus: statusCounts,
    byPriority: priorityCounts
  };
}

// Helper function to sort tasks by date
function sortTasksByDate(tasks, order) {
  return tasks.sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    
    if (order === 'asc') {
      return dateA - dateB;
    } else {
      return dateB - dateA;
    }
  });
}

// Clear all (for testing)
function clearAll() {
  taskStore.clearAllTasks();
}

module.exports = {
  createNewTask,
  fetchTasks,
  getTask,
  modifyTask,
  removeTask,
  getTaskStats,
  clearAll
};
