const mongoose = require("mongoose")

const taskSchema = mongoose.Schema({
    title: {type : String , required : true},
    description: {type : String , required : true},
    userId : { type : mongoose.Schema.Types.ObjectId,ref : "User"},
    status : {type : String , 
    enum : ['completed' , 'pending']
}
})

const Task = mongoose.model("Task",taskSchema)

module.exports = { Task }