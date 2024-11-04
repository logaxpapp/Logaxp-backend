
import { authenticated } from '@/config/jwt'
import express from 'express'
import { UserController } from '@/controller/user-controller'
const {createUser, verifyEmail, login, resetPassword, updatePassword, updateProfile, updateInAppPassword, requestAccountDeletion, getProfile} = new UserController()
const router = express.Router()
router.post("/register", createUser)
router.post("/verify-email", verifyEmail)
router.post("/login", login)
router.post("/reset-password-link", resetPassword)
router.post("/update-password", updatePassword)

router.use(authenticated)
router.get("/profile", getProfile)
router.put("/profile", updateProfile)
router.put("/profile/password", updateInAppPassword)
router.delete("/profile", requestAccountDeletion)



export default router