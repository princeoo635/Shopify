import {Router} from 'express'
import {registerUser} from '../controller/user.controller.js'
import {upload} from '../middleware/multer.middleware.js'

const router=Router();
router.route('/register').post(upload.single("profileImage"),registerUser)

export default router