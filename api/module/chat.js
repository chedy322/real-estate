const mongoose=require('mongoose')
 //recently addded should be fixed talking about messages

const chatSchema=new mongoose.Schema({
    userIds:{
        type:[String]
    },
    seenBy:{
        type:[String]
    },
    messages:{
        type:[String]
    },
    last_message:{
        type:String
    },
},{
    timestamps:true
})

module.exports=mongoose.model('Chat',chatSchema)