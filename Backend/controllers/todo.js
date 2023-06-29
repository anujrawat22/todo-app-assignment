const { Client } = require('@elastic/elasticsearch');



// ElasticSearch client setup
const elasticClient = new Client({ node: 'http://localhost:8080' });

// Redis client setup
const  { createClient } = require('redis');
const { Task } = require('../model/task.model');

const redisClient = createClient({
    password: process.env.redis_pass,
    socket: {
        host: process.env.redis_host,
        port: 14265
    }
});


exports.createTasks = async (req, res) => {
    const { title, description ,userId } = req.body;
  
    try {
        
      // Store the task in MongoDB
      const task = new Task({ title, description , userId,status : 'pending' });
      await task.save();
  
      const taskId = task._id.toString();
  console.log(taskId)
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
  }




  exports.searchTasks =  async (req, res) => {
    const { query } = req.query;
    const {userId } = req.body
    try {
      // Search tasks in ElasticSearch
      const { body } = await elasticClient.search({
        index: 'tasks',
        body: {
          query: {
            bool: {
              must: [
                { match: { userId } }, 
                {
                  multi_match: {
                    query,
                    fields: ['title', 'description']
                  }
                }
              ]
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
  }


  exports.updateTask = async(req,res)=>{
    const {id} = req.params
    const {title, description,userId,status} = req.body;
    try {
        
        const task = await Task.findOne({_id : id, userId })
        if(task){
            await Task.findByIdAndUpdate( id,{title,description,status})

            await elasticClient.update({
                index: 'tasks',
                id,
                body: {
                  doc: {
                    title,
                    description,
                    status
                  }
                }
              });

              redisClient.set(id, JSON.stringify({ title, description,status }));

            res.status(204).send({msg : "Task updated successfully"})
        }else{
            res.status(404).send({msg : "Task Not found"})
        }
    } catch (error) {
        console.error('Error updating task:', err);
      return res.status(500).json({ error: 'An error occurred while updating the task.' });
    }
  }



  exports.deleteTasks =  async (req, res) => {
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
  }