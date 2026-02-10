const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// GET /tasks/stats - Get statistics
router.get('/stats', taskController.getStats);

// GET /tasks - Get all tasks
router.get('/', taskController.getTasks);

// GET /tasks/:id - Get task by id
router.get('/:id', taskController.getTaskById);

// POST /tasks - Create new task
router.post('/', taskController.createTask);

// PUT /tasks/:id - Update task
router.put('/:id', taskController.updateTask);

// DELETE /tasks/:id - Delete task
router.delete('/:id', taskController.deleteTask);

module.exports = router;
