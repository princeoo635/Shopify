import {Router} from 'express'
import {home,login,register,updateUser,profileUpdate,changePassword} from '../controller/home.controller.js'
import {verifyJWT} from '../middleware/auth.middleware.js'


const router=Router()

router.route('/').get(home)
router.route('/register').get(register)
router.route('/login').get(login)
router.route('/updateUser').get(verifyJWT,updateUser)
router.route('/profileUpdate').get(verifyJWT,profileUpdate)
router.route('/changePassword').get(verifyJWT,changePassword)

export default router;