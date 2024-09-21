const jwt=require('jsonwebtoken')


const authenticate=async (req,res,next)=>{
    //take token from cookie
    const cookie=req.cookies.token
    if(!cookie){
        return res.status(401).json({message:"unauthorized"})
    }
    try{
        var decoded=await jwt.verify(cookie,'chedy')
        // console.log(decoded)
        req.user={
            username:decoded.username,
            id:decoded.id
        }
        next()

    }catch(err){console.log(err)
        return res.status(401).send('Invalid token'); 
    }
    
}
// const Should_be_Admin=async ()=>{
//     const cookie=req.cookies.token
//     if(!cookie){
//         return res.status(401).json({message:"unauthorized"})
//     }
//     try{
//         var decoded=await jwt.verify(cookie,'chedy')
//         // console.log(decoded)
//         if(!decoded.isAdmin){
//             return res.status(401).json({message:"you are not the admin"})
//         }
//         req.user={
//             username:decoded.username,
//             id:decoded.id
//         }
//         next()

//     }catch(err){console.log(err)
//         return res.status(401).send('Invalid token'); 
//     }

// }

module.exports=authenticate