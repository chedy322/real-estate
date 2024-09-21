const express=require('express')
const {addmessage}=require('../controllers/message')
const router=express.Router()



router.route('/:id').post(addmessage)


module.exports=router;
