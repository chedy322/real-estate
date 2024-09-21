const express=require('express')
const app=express()
const cookie=require('cookie-parser')
const port=process.env.port||3200
const connect=require('./db/connect')
const cors=require('cors')
const path = require('node:path');


//
app.use(express.json())
app.use(cookie({
    origin:"http://localhost:5173/",
    credentials:true
}))
//add origin and credentials:true
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}
))
// require('../')
app.use('/uploads',express.static(path.join(__filename,'../uploads')))
app.use('/photos',express.static(path.join(__filename,'../photos')))
//authentication route
app.use('/auth',require('./route/auth'))
app.use('/',require('./route/email'))
//protected route
app.use(require('./middleware/auth'))
app.use('/',require('./route/post'))
app.use('/user',require('./route/user'))
app.use('/chat',require('./route/chat'))
app.use('/message',require('./route/message'))


const start=async ()=>{
    try{
        await connect("mongodb+srv://Taskmanager:chedy12345@chedy.bmutqsh.mongodb.net/?retryWrites=true&w=majority&appName=chedy")
        app.listen(port,()=>{
            console.log(`server is running on port ${port}`)
        }
        )
        
    }catch(err){
        console.log(err)
    }
}

start()




