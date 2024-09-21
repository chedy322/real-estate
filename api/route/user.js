const express=require('express')
const router=express.Router()
const{UpdateProfile,DeleteProfile,Profile}=require('../controllers/user')


router.route('/saved').get(Profile)
router.route('/:id').put(UpdateProfile)
.delete(DeleteProfile)


module.exports=router