const mongoose = require("mongoose")

const todoSchema = mongoose.Schema({
    title: {type : String , required : true},
    description: {type : String , required : true},
    userId : { type : mongoose.Schema.Types.ObjectId},
    status : {type : String , 
    enum : ['completed' , 'pending']
}
})

const Todo_model = mongoose.model("Todo",todoSchema)

module.exports = { Todo_model }