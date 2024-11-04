
import { authenticated, AuthorizedMiddleware } from '@/config/jwt'
import express from 'express'
import { AdminController } from '@/controller/admin-controller'
const router = express.Router()

const { approveRequest, rejectRequest, createEmployee, getRequests} = new AdminController()
router.use(authenticated, AuthorizedMiddleware(["admin"]))
router.post("/add-employee", createEmployee)
router.get("/deletion-requests", getRequests)
router.put("/deletion-requests/:id/approve", approveRequest)
router.put("/deletion-requests/:id/reject", rejectRequest)



export default router