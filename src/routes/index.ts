import express from "express";
const routes = express.Router();
import auth from './user.route';
import admin from './admin.route'
routes.use('/auth', auth)
routes.use('/admin', admin)
export default routes;
