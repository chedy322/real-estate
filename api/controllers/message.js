const mongoose=require('mongoose')
const message=require('../module/message')
const chat=require('../module/chat')


const addmessage=async (req,res)=>{
    try{
        const {id:user_id}=req.user
        // console.log(user)
        const{id:chat_id}=req.params
        // need to add chechikng for user id and message
        const added_message=await message.create({
            userId:user_id,
            chatId:chat_id,
            message:req.body.message
        })
        await chat.findOneAndUpdate(
            {
                _id: chat_id,
                userIds: { $in: [user_id] }
            },
            {
                // i fixed it here to make the push all in once
                $push: {
                    messages: req.body.message,
                    seenBy: user_id
                },
                $set: {
                    last_message: req.body.message
                }
            },
            { new: true }
        );
        
        return res.status(201).json(added_message)
    }catch(err){
        console.log(err)
        return res.status(500).json({message:"failed adding message"})

    }
}




module.exports={addmessage}