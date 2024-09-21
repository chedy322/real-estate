
const {GetAllPosts,Savepost,createPost,getPostById,UpdatePost}=require('../controllers/post')
const express=require('express')
const router=express.Router()


router.route('/post').get(GetAllPosts)
router.route('/post').post(createPost)
router.route('/save').post(Savepost)

//by id
router.route('/post/:id').get(getPostById)
.put(UpdatePost)



module.exports=router