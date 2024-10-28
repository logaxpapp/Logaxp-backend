
import { authenticated } from '@/config/jwt'
import express from 'express'
import { UserController } from '@/controller/user-controller'
const {createUser, verifyEmail, login} = new UserController()
const router = express.Router()
router.post("/register", createUser)
router.post("/verify-email", verifyEmail)
router.patch("/login", login)



export default router