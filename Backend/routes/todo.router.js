const {
  createTasks,
  searchTasks,
  deleteTasks,
  updateTask,
} = require("../controllers/todo");

const todo_router = require("express").Router();

// API endpoint for creating a new task
todo_router.post("/tasks", createTasks);

// API endpoint for searching tasks
todo_router.get("/tasks/search", searchTasks);


// API endpoint for updating the task

todo_router.patch("/tasks/update/:id" , updateTask)

// API endpoint for deleting a task
todo_router.delete("/tasks/:id", deleteTasks);

module.exports = { todo_router };
