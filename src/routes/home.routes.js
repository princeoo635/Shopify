import {Router} from 'express'
import {home} from '../controller/home.controller.js'

const router=Router()

router.route('/').get(home)

export default router;