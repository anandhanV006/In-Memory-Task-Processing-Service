const taskService = require('../services/taskService');
const { validateCreateTask, validateUpdateTask, validateFilters, isValidUUID } = require('../utils/validation');

// Create new task
async function createTask(req, res) {
  try {
    // Validate input
    const validation = validateCreateTask(req.body);
    
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    // Create task
    const task = taskService.createNewTask(req.body);

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task
    });

  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

// Get all tasks
async function getTasks(req, res) {
  try {
    // Validate query parameters
    const validation = validateFilters(req.query);
    
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid query parameters',
        errors: validation.errors
      });
    }

    // Build filters from query
    const filters = {
      status: req.query.status,
      priority: req.query.priority,
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder
    };

    const tasks = taskService.fetchTasks(filters);

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });

  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

// Get single task
async function getTaskById(req, res) {
  try {
    const { id } = req.params;

    // Validate UUID
    if (!isValidUUID(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID format'
      });
    }

    const task = taskService.getTask(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      data: task
    });

  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

// Update task
async function updateTask(req, res) {
  try {
    const { id } = req.params;

    // Validate UUID
    if (!isValidUUID(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID format'
      });
    }

    // Validate update data
    const validation = validateUpdateTask(req.body);
    
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    const updatedTask = taskService.modifyTask(id, req.body);

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTask
    });

  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

// Delete task
async function deleteTask(req, res) {
  try {
    const { id } = req.params;
    const hardDelete = req.query.hard === 'true';

    // Validate UUID
    if (!isValidUUID(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID format'
      });
    }

    const deleted = taskService.removeTask(id, hardDelete);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      message: hardDelete ? 'Task permanently deleted' : 'Task deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

// Get statistics
async function getStats(req, res) {
  try {
    const stats = taskService.getTaskStats();

    res.status(200).json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getStats
};
