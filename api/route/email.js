const express=require('express')
const router=express.Router()
const send_email=require('../controllers/email')


router.route('/email').post(send_email)


module.exports=router