const mongoose=require('mongoose')
const user=require('../module/User')

const register=async (req,res)=>{
   try{
        const{username,password,email}=req.body
        if(!username||!password||!email){
            return res.send({message:'please fill the form'})
        }
        //check by email and should add check bu suername 
        const existing_user=await user.findOne({email:email})
        if(existing_user){
            return res.status(200).json({message:'email already exists'})
        }
        const newUser=await user.create({...req.body}) 
        return res.status(201).json({message:"user created successfully"})
    }catch(err){
        console.log(err)
        res.status(501).json({message:"something happened"})
    }
    

   
        

}





const login=async (req,res)=>{
    try{
        const{email,password}=req.body
        if(!password || !email){
            return res.status(400).json({ message: 'Please fill in both email and password.' })//add status
        }
        const existing_user=await user.findOne({email})
        if(!existing_user){
            return res.status(401).json({message:"User doesn't exist please register"})
        }
        const match=await existing_user.comparePasword(password)
        if(!match){
            return res.status(401).json({message:'wrong email or password'})
        }
        //add token later with cookie
        const age=1000*60*60*24*7
        //to object converting mongoose to object 
        const{password:userPass,...userInfo}=existing_user.toObject();
        // console.log(userInfo)
        const token=await existing_user.createJwt()
        return res.cookie('token',token,{
            httpOnly:true,
            secure:true,
            maxAge:age
        }).status(201).json(userInfo)

    }catch(err){
        console.log(err);
        res.status(501).json({message:"something happened"})

    }
}




const logout=(req,res)=>{
    //logout by deleting the jwt from the cookie 
    return res.cookie("token","").status(200).json({message:"logged out"})

}




module.exports={register,login,logout}


