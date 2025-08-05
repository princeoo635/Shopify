import {Router} from 'express'
import {home,login,register,updateUser,profileUpdate} from '../controller/home.controller.js'
import {verifyJWT} from '../middleware/auth.middleware.js'


const router=Router()

router.route('/').get(home)
router.route('/register').get(register)
router.route('/login').get(login)
router.route('/updateUser').get(verifyJWT,updateUser)
router.route('/profileUpdate').get(verifyJWT,profileUpdate)

export default router;