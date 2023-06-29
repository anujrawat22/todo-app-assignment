const express = require("express")
const cors = require('cors')
const { connection } = require("./config/db")
require("dotenv").config()
const app = express()

const { todo_router } = require("./routes/todo.router")
const { UserRouter } = require("./routes/user.router")
const { authenticate } = require("./middleware/authenticate")


app.use(express.json())
app.use(cors())

app.use("/user",UserRouter)

app.use("/todo",authenticate,todo_router)


app.listen(process.env.PORT|| 8080 , async()=>{
    try {
        await connection;
        console.log("Connected to DB")
        console.log(`Listening on PORT ${process.env.PORT}`);
    } catch (error) {
        console.log("Error" , error)
    }
})