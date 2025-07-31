import {Router} from 'express'
import {registerUser,loginUser} from '../controller/user.controller.js'
import {upload} from '../middleware/multer.middleware.js'

const router=Router();
router.route('/register').post(upload.single("profileImage"),registerUser)

router.route('/login').post(loginUser)

export default router