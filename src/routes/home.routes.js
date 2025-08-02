import {Router} from 'express'
import {home,login} from '../controller/home.controller.js'

const router=Router()

router.route('/').get(home)
router.route('/login').get(login)

export default router;