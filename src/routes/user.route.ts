
import { authenticated } from '@/config/jwt'
import express from 'express'
import { UserController } from '@/controller/user-controller'
const {createUser, verifyEmail, login, resetPassword, updatePassword} = new UserController()
const router = express.Router()
router.post("/register", createUser)
router.post("/verify-email", verifyEmail)
router.post("/login", login)
router.post("/reset-password-link", resetPassword)
router.post("/update-password", updatePassword)



export default router