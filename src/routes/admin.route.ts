
import { authenticated, AuthorizedMiddleware } from '@/config/jwt'
import express from 'express'
import { AdminController } from '@/controller/admin-controller'
const router = express.Router()

const { approveRequest, rejectRequest, createEmployee, getRequests} = new AdminController()
router.use(authenticated, AuthorizedMiddleware(["admin"]))
router.get("/deletion-requests", getRequests)
router.put("/admin/deletion-requests/:id/approve", getRequests)
router.get("/deletion-requests/:id/reject", getRequests)



export default router