import {Router} from 'express'
import {registerUser,loginUser,logoutUser,getCurrentUser,changeProfile} from '../controller/user.controller.js'
import {upload} from '../middleware/multer.middleware.js'
import {verifyJWT} from '../middleware/auth.middleware.js'

const router=Router();
router.route('/register').post(upload.single("profileImage"),registerUser)

router.route('/login').post(loginUser)

router.route('/logout').post(verifyJWT,logoutUser)
router.route('/currentUser').get(verifyJWT,getCurrentUser)
router.route('/profileUpdate').post(verifyJWT,upload.single("profileImage"),changeProfile)

export default router