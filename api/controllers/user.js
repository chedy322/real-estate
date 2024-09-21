const mongoose=require('mongoose')
const user=require('../module/User')
const saved=require('../module/SavePost')
const posts=require('../module/Post')
const { findByIdAndUpdate } = require('../module/Post')
const multer=require('multer')
const fs=require('fs')
const path=require('path')
const bcrypt=require('bcrypt')
// const upload=multer({dest:'../uploads/'}).single('avatar')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname,'../uploads/'))
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const upload = multer({ storage: storage }).single('avatar')
//updating user be based onn id of the user 
//we nned to get the id from the params url and then update it 
//to do fix image loading


const UpdateProfile = function(req, res) {
  upload(req, res, async function(err) {
      if (err) {
          return res.status(400).json({ message: "Error during file upload" });
      }
      try {
          const { id } = req.params;
          // console.log(req.body);
          const{password,...inputs}=req.body
          // console.log(avatar);
          console.log(req.file);
          let new_path=null
          if (req.file) {
              const { originalname, path } = req.file;
              const original = originalname.split('.');
              const ext = original[original.length - 1];
              new_path = path + '.' + ext;
              fs.renameSync(path,new_path)
          }
          let updatedpassword=null
          if(password){
            updatedpassword=await bcrypt.hash(password,10)
          }

          const updatedUser = await user.findOneAndUpdate(
              { _id: id }, {
                ...inputs,
                ...(updatedpassword &&{password:updatedpassword}),
                ...(req.file&&{avatar:new_path})

              },
              { new: true }
          );
          console.log(updatedUser)

          if (!updatedUser) {
              return res.status(404).json({ message: "User not found" });
          }

          const { password2, ...userInfo } = updatedUser._doc;
          return res.status(200).json(userInfo);
      } catch (err) {
          console.log(err);
          return res.status(500).json({ message: "Failed to update profile" });
      }
  });
};


const DeleteProfile=async (req,res)=>{
    try{
      // getting the user id from params
      const {id}=req.params
      const {id:user_id}=req.user
      const existig_user=await user.findOne({_id:id})

      //only user or admin can delete profile
      if(user_id!==existig_user._id.toString()) return res.status(500).json({message:'you are not allowed to delete this account'})

        const deleted=await user.findOneAndDelete({_id:id})
        return res.status(201).json({message:"deleted profile"})

    }catch(err){
        console.log(err)
        return res.status(500).json({message:"failed to delete profile"})

    }
}

const Profile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Fetch posts made by the user
    const relative_posts = await posts.find({ userId }).sort('createdAt');
    
    // Fetch saved posts by the user
    const relative_savedposts = await saved.find({ userId });
    
    // Extract postIds from saved posts
    const savedPostIds = relative_savedposts.map(item => item.postId);
    
    // Find the posts that match the saved post IDs
    const savedPosts = await posts.find({ _id: { $in: savedPostIds } });

    // Prepare the response data
    const response = {
      relative_posts,
      relative_savedposts: savedPosts
    };

    return res.status(200).json(response);

  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: 'Failed getting user posts' });
  }
};


module.exports={UpdateProfile,DeleteProfile,Profile}