// Validation helper functions

// Validate UUID format
function isValidUUID(uuid) {
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidPattern.test(uuid);
}

// Validate task status
function isValidStatus(status) {
  const validStatuses = ['todo', 'in_progress', 'done'];
  return validStatuses.includes(status);
}

// Validate task priority
function isValidPriority(priority) {
  const validPriorities = ['low', 'medium', 'high'];
  return validPriorities.includes(priority);
}

// Validate task creation data
function validateCreateTask(data) {
  const errors = [];

  // Check title
  if (!data.title || data.title.trim() === '') {
    errors.push({ field: 'title', message: 'Title is required' });
  } else if (data.title.length < 3) {
    errors.push({ field: 'title', message: 'Title must be at least 3 characters' });
  } else if (data.title.length > 100) {
    errors.push({ field: 'title', message: 'Title must not exceed 100 characters' });
  }

  // Check description if provided
  if (data.description && data.description.length > 500) {
    errors.push({ field: 'description', message: 'Description must not exceed 500 characters' });
  }

  // Check status if provided
  if (data.status && !isValidStatus(data.status)) {
    errors.push({ field: 'status', message: 'Status must be one of: todo, in_progress, done' });
  }

  // Check priority if provided
  if (data.priority && !isValidPriority(data.priority)) {
    errors.push({ field: 'priority', message: 'Priority must be one of: low, medium, high' });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Validate task update data
function validateUpdateTask(data) {
  const errors = [];

  // Check if at least one field is provided
  const hasFields = data.title || data.description !== undefined || data.status || data.priority;
  if (!hasFields) {
    errors.push({ message: 'At least one field (title, description, status, priority) must be provided' });
    return { isValid: false, errors };
  }

  // Check title if provided
  if (data.title !== undefined) {
    if (data.title.trim() === '') {
      errors.push({ field: 'title', message: 'Title cannot be empty' });
    } else if (data.title.length < 3) {
      errors.push({ field: 'title', message: 'Title must be at least 3 characters' });
    } else if (data.title.length > 100) {
      errors.push({ field: 'title', message: 'Title must not exceed 100 characters' });
    }
  }

  // Check description if provided
  if (data.description !== undefined && data.description.length > 500) {
    errors.push({ field: 'description', message: 'Description must not exceed 500 characters' });
  }

  // Check status if provided
  if (data.status && !isValidStatus(data.status)) {
    errors.push({ field: 'status', message: 'Status must be one of: todo, in_progress, done' });
  }

  // Check priority if provided
  if (data.priority && !isValidPriority(data.priority)) {
    errors.push({ field: 'priority', message: 'Priority must be one of: low, medium, high' });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Validate query filters
function validateFilters(query) {
  const errors = [];

  // Check status filter
  if (query.status && !isValidStatus(query.status)) {
    errors.push({ field: 'status', message: 'Status must be one of: todo, in_progress, done' });
  }

  // Check priority filter
  if (query.priority && !isValidPriority(query.priority)) {
    errors.push({ field: 'priority', message: 'Priority must be one of: low, medium, high' });
  }

  // Check sortBy
  if (query.sortBy && query.sortBy !== 'createdAt') {
    errors.push({ field: 'sortBy', message: 'sortBy must be: createdAt' });
  }

  // Check sortOrder
  if (query.sortOrder && !['asc', 'desc'].includes(query.sortOrder)) {
    errors.push({ field: 'sortOrder', message: 'sortOrder must be either asc or desc' });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

module.exports = {
  isValidUUID,
  validateCreateTask,
  validateUpdateTask,
  validateFilters
};
