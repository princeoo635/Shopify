import {Router} from 'express'
import {home,login,register} from '../controller/home.controller.js'

const router=Router()

router.route('/').get(home)
router.route('/register').get(register)
router.route('/login').get(login)

export default router;