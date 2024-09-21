
const mongoose=require('mongoose')

const postDetail=new mongoose.Schema({
    id:String,  
    desc:String,
    utilities:String,
    pet:String,
    income:String,
    size:Number,
    school     :Number,
    bus        :Number,
    restaurant :Number,  
    // postId     :String 

})


module.exports=mongoose.model('PostDetail',postDetail)