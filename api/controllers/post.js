const mongoose=require('mongoose')
const post=require('../module/Post')
const user=require('../module/User')
const saved_post=require('../module/SavePost')
const jwt=require('jsonwebtoken')
const multer=require('multer')
const fs=require('fs')
const path=require('path')
//finding all posts
// should be open source to everyone 
// const storage

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Add a static file path in the app
        cb(null, path.join(__dirname, '../photos/'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});

const upload = multer({ storage: storage }).array('photos',4);
  
const GetAllPosts=async (req,res)=>{
    const query=req.query;
    
    mongo_query={}
    if (query.city) {
        mongo_query.city = query.city;
    }

    if (query.type) {
        mongo_query.type = query.type;
    }

    if (query.property) {
        mongo_query.property = query.property;
    }
    if(query.bedroom){
        mongo_query.bedroom=query.bedroom

    }
    if (query.minPrice || query.maxPrice) {
        mongo_query.price = {};
        if (query.minPrice) {
            mongo_query.price.$gte = parseInt(query.minPrice);
        }
        if (query.maxPrice) {
            mongo_query.price.$lte = parseInt(query.maxPrice);
        }
    }
    
    try{
        const existing_post=await post.find(mongo_query).sort('createdAt')
        return res.status(201).json(existing_post)
    }catch(err){
        console.log(err)
        res.status(401).json({message:"error finding posts"})
    }


}
// only signed in can create post
// finish from here
const createPost = function (req, res) {
    upload(req, res, async function (err) {
        if (err) {
            return res.status(400).json({message:'error uploading files'})
        }
        try {
            const { id } = req.user;
            // console.log(req.files)
            const object=req.body.payload
            data=JSON.parse(object)
            // console.log(object.postData)
            // console.log(req.body.postData);
            // console.log(req.body.payload['postDetail']);
            if (!id) {
                return res.status(400).json({ message: 'You need to be logged in to create a post' });
            }

            // Saving the file with its extension
            let images_path=[];
            if (req.files && req.files.length > 0) {
                req.files.forEach(file => {
                    const { path, originalname } = file;
                    const original = originalname.split('.');
                    const ext = original[original.length - 1];
                    const new_path = `${path}.${ext}`;
                    fs.renameSync(path, new_path);
                    images_path.push(new_path)
                });
            }
            const Post = await post.create({
            ...data.postData,
            images:images_path,
                userId: id,
                postDetail: { ...data.postDetail }
            });
            // console.log(Post)

            return res.status(201).json({ Post });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: 'Error creating post' });
        }
    });
};



// by id
const getPostById=async (req,res)=>{
    try{
        const {id}=req.params;
        // console.log(id)
        const existing_post=await post.findOne({_id:id})
        const relative_user = await user.findOne({ _id: existing_post.userId }).select(['username', 'avatar', '_id']);
        if(!existing_post) return res.status(404).json({message:"post not found"})
        let userId;
        const token=req.cookies.token
        if(!token){
            userId=null
        }else{
          try{
            const payload=await jwt.verify(token,'chedy')
            userId=payload.id;
            const check_saved=await saved_post.find({postId:id,userId})
            isSaved=check_saved.length!==0?true:false

          }catch(err){
           userId=null

          }
        }
        //  isSaved:(check_saved.length!==0)?true:false
        //check saved is undeifned here
        console.log(existing_post)
    
        return res.status(201).json({existing_post,relative_user,isSaved})
    }
    catch(err){
        console.log(err)
        return res.status(500).json({message:'error finding post'})

    }

}
// only admin or post user can update
const UpdatePost=async (req,res)=>{
    try {
        const { id } = req.params; // Extracting the post ID from the request parameters
        const existing_post = await post.findOne({ _id: id }); // Finding the existing post by ID
    
        if (!existing_post) {
            // Check if the post exists
            return res.status(404).json({message:'Post not found'}); // Respond with 404 if not found
        }
    
        const { id: us } = req.user; // Extracting the user ID from the request user object
    
        // Check if the user is the owner of the post or has admin privileges
        // Assuming you will add the admin check logic here later
    
        if (us !== existing_post.userId.toString()) {
            return res.status(403).json({message:'You are not allowed to edit this post'}); // Respond with 403 for forbidden action
        }
        //need to check this
        const updatedData = {
            ...req.body,
            postDetail: req.body.postDetail ? 
              { ...existing_post.postDetail.toObject(), ...req.body.postDetail } : 
              existing_post.postDetail
          };
        const updated_post = await post.findOneAndUpdate({_id:id},{$set:updatedData}, { new: true }); // Update the post
    
        return res.status(200).json(updated_post); // Respond with the updated post
    } catch (err) {
        console.error(err); // Log the error for debugging
        return res.status(500).json({message:'Error updating post'}); // Respond with 500 for server error
    }
    

}
// only admin or post user can delete
// const DeletePost=async (req,res)=>{
//     try{

//         const { id } = req.params; // Extracting the post ID from the request parameters
//         const existing_post = await post.findOne({ _id: id }); // Finding the existing post by ID
    
//         if (!existing_post) {
//             // Check if the post exists
//             return res.status(404).json({message:'Post not found'}); // Respond with 404 if not found
//         }
    
//         const { id: us } = req.user; // Extracting the user ID from the request user object
    
//         // Check if the user is the owner of the post or has admin privileges
//         // Assuming you will add the admin check logic here later
    
//         if (us !== existing_post.userId.toString()) {
//             return res.status(403).json({message:'You are not allowed to edit this post'}); // Respond with 403 for forbidden action
//         }
//         const deleted_post=await post.findOneAndDelete({_id:id});
//         return res.status(200).json(deleted_post); // Respond with the deleted post
//     }catch(err){
//         return res.status(500).json({message:'error deleting post'})
//     }


// }

const Savepost=async (req,res)=>{
    const {postId}=req.body//get the post id
    const {id}=req.user//get the user id
    try{
        const saved=await saved_post.find({postId,userId:id})
        // console.log(saved)
        if(saved.length!==0){
            const removed=await saved_post.findOneAndDelete({postId,userId:id})
            return res.status(200).json({message:"Post removed from saved list"})

        }else{
            const create_saved=await saved_post.create({postId,userId:id})
            return res.status(201).json({message:'Post saved '})
        }
    }catch(err){
        console.log(err)
        return res.json(500).json({message:'error saving post'})
    }

}

module.exports={GetAllPosts,createPost,getPostById,UpdatePost,Savepost}