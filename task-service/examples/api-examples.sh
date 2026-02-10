#!/bin/bash

# Example API usage script
# Make sure server is running on port 8070

BASE_URL="http://localhost:8070"

echo "Task Service API Examples"
echo "========================="
echo ""

# Health check
echo "1. Health Check:"
curl -s "$BASE_URL/health"
echo -e "\n"

# Create tasks
echo "2. Creating tasks..."
TASK1=$(curl -s -X POST "$BASE_URL/tasks" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "priority": "high"
  }')
echo "Created task 1"

TASK2=$(curl -s -X POST "$BASE_URL/tasks" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete assignment",
    "status": "in_progress",
    "priority": "high"
  }')
echo "Created task 2"

TASK3=$(curl -s -X POST "$BASE_URL/tasks" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Read book",
    "status": "done",
    "priority": "low"
  }')
echo "Created task 3"
echo ""

# Get all tasks
echo "3. Get all tasks:"
curl -s "$BASE_URL/tasks"
echo -e "\n"

# Filter by status
echo "4. Filter by status (todo):"
curl -s "$BASE_URL/tasks?status=todo"
echo -e "\n"

# Filter by priority
echo "5. Filter by priority (high):"
curl -s "$BASE_URL/tasks?priority=high"
echo -e "\n"

# Get stats
echo "6. Get statistics:"
curl -s "$BASE_URL/tasks/stats"
echo -e "\n"

echo "Examples completed!"
