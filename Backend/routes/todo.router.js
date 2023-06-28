const todo_router = require("express").Router()

const { Client } = require('@elastic/elasticsearch');
const redis = require('redis');

// ElasticSearch client setup
const elasticClient = new Client({ node: 'http://localhost:8080' });

// Redis client setup
const redisClient = redis.createClient();


// API endpoint for creating a new task
todo_router.post('/tasks', async (req, res) => {
    const { title, description } = req.body;
  
    try {
      // Store the task in MongoDB
      const task = new Task({ title, description });
      await task.save();
  
      const taskId = task._id.toString();
  
      // Store the task in ElasticSearch
      await elasticClient.index({
        index: 'tasks',
        id: taskId,
        body: {
          title,
          description
        }
      });
  
      // Store the task in Redis
      redisClient.set(taskId, JSON.stringify({ title, description }));
  
      return res.status(201).json({ message: 'Task created successfully.' });
    } catch (err) {
      console.error('Error creating task:', err);
      return res.status(500).json({ error: 'An error occurred while creating the task.' });
    }
  });
  
  // API endpoint for searching tasks
  todo_router.get('/tasks/search', async (req, res) => {
    const { query } = req.query;
  
    try {
      // Search tasks in ElasticSearch
      const { body } = await elasticClient.search({
        index: 'tasks',
        body: {
          query: {
            multi_match: {
              query,
              fields: ['title', 'description']
            }
          }
        }
      });
  
      const hits = body.hits.hits;
  
      // Fetch tasks from Redis based on search results
      redisClient.mget(hits.map(hit => hit._id), (err, tasks) => {
        if (err) {
          console.error('Error fetching tasks from Redis:', err);
          return res.status(500).json({ error: 'An error occurred while fetching tasks.' });
        }
  
        const taskList = tasks.map(task => JSON.parse(task));
  
        return res.json({ tasks: taskList });
      });
    } catch (err) {
      console.error('Error searching tasks:', err);
      return res.status(500).json({ error: 'An error occurred while searching for tasks.' });
    }
  });
  
  // API endpoint for deleting a task
  todo_router.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      // Delete the task from MongoDB
      await Task.deleteOne({ _id: id });
  
      // Delete the task from ElasticSearch
      await elasticClient.delete({
        index: 'tasks',
        id
      });
  
      // Delete the task from Redis
      redisClient.del(id, (err) => {
        if (err) {
          console.error('Error deleting task from Redis:', err);
          return res.status(500).json({ error: 'An error occurred while deleting the task.' });
        }
  
        return res.json({ message: 'Task deleted successfully.' });
      });
    } catch (err) {
      console.error('Error deleting task:', err);
      return res.status(500).json({ error: 'An error occurred while deleting the task.' });
    }
  });


  module.exports = {todo_router}