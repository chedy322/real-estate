const mongoose=require('mongoose')





const SavePost=new mongoose.Schema({
    userId:{
        type:String,
    },
    postId:{
        type:String
    },


},{
    timestamps:true
})


module.exports=mongoose.model('SavaPost',SavePost)