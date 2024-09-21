const mongoose=require('mongoose');
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt');
const { Timestamp } = require('mongodb');



//add more condition later 

const Schema=new mongoose.Schema({
    email: {
        type: String,
        unique:true
    },
    username:{
        type:String,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    avatar:{
        type:String,
    }
    
},
{
    timestamps:true
}
)

Schema.pre('save',async function(){
    const salt=await bcrypt.genSalt(10)
    this.password=await bcrypt.hash(this.password,salt)
})

Schema.methods.comparePasword=async function(sugPass){
    const match=await bcrypt.compare(sugPass,this.password)
    return match
}
// Schema.pre('findOneAndUpdate', async function (next) {
//     const update = this.getUpdate();
  
//     if (update.password) { 
//       const salt = await bcrypt.genSalt(10);
//       update.password = await bcrypt.hash(update.password, salt);
//     }
  
//     next();
//   });
  
//creating jwt method
//add secret to dotenv
Schema.methods.createJwt=async function(){
    const token=await jwt.sign({
        username:this.username,
        id:this._id,
        isAdmin:false//chaniginf probably later 
    },
        'chedy',
        {
            expiresIn:'30d'
        }


    )
    return token

}


module.exports=mongoose.model('User',Schema)