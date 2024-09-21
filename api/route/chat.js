const { getAllchats, getChat, deleteChat, createChat }=require('../controllers/chat')
const express=require('express')

const router=express.Router()



router.route('/').get(getAllchats)
.post(createChat)
router.route('/:id').get(getChat)
.delete(deleteChat)



module.exports=router
