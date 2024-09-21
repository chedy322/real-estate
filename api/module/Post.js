const { Timestamp } = require('mongodb')
const mongoose=require('mongoose')
const postDetail=require('./Postdetail')
// post [icon: users, color: blue] {
    //     post_id String pk
    //     userId int 
    //     title stringprice int
    //     images string[]
    //     address string
    //     price int 
    //     city string
    
    // }
    const Schema=new mongoose.Schema({
    userId:{
        type:String,
    },
    title:{
        type:String
    },
    images:{
        type:[String]
    },
    address:{
        type:String
        
    },
    price:{
        type:Number
    },
    city:{
        type:String
    },
    bedroom:{
        type:String
    },
    bathroom:{
        type:String
    },
    latitude:{
        type:String
    },
    property:{
        type:String
    },
    type:{
        type:String
    },
    postDetail:[postDetail.schema]


},{Timestamp:true})




module.exports=mongoose.model('Post',Schema)
