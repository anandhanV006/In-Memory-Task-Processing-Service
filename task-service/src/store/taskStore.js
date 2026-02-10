// In-memory storage for tasks
// Using Map for better performance than array
let tasksData = new Map();

// Get all tasks from store
function getAllTasks() {
  return Array.from(tasksData.values());
}

// Find task by id
function findTaskById(taskId) {
  return tasksData.get(taskId);
}

// Add new task to store
function addTask(task) {
  tasksData.set(task.id, task);
  return task;
}

// Update existing task
function updateTaskById(taskId, updateData) {
  const existingTask = tasksData.get(taskId);
  
  if (!existingTask) {
    return null;
  }

  const updatedTask = {
    ...existingTask,
    ...updateData,
    id: existingTask.id, // don't allow id change
    createdAt: existingTask.createdAt, // preserve created date
    updatedAt: new Date()
  };

  tasksData.set(taskId, updatedTask);
  return updatedTask;
}

// Remove task from store (hard delete)
function deleteTaskById(taskId) {
  return tasksData.delete(taskId);
}

// Soft delete - mark as deleted
function softDeleteTask(taskId) {
  const task = tasksData.get(taskId);
  
  if (!task) {
    return null;
  }

  const deletedTask = {
    ...task,
    isDeleted: true,
    deletedAt: new Date()
  };

  tasksData.set(taskId, deletedTask);
  return deletedTask;
}

// Get only active tasks (not deleted)
function getActiveTasks() {
  const allTasks = Array.from(tasksData.values());
  return allTasks.filter(task => !task.isDeleted);
}

// Clear all tasks (for testing)
function clearAllTasks() {
  tasksData.clear();
}

// Check if task exists
function taskExists(taskId) {
  return tasksData.has(taskId);
}

module.exports = {
  getAllTasks,
  findTaskById,
  addTask,
  updateTaskById,
  deleteTaskById,
  softDeleteTask,
  getActiveTasks,
  clearAllTasks,
  taskExists
};
