import express from "express";
const routes = express.Router();
import auth from './user.route';
routes.use('/auth', auth)
export default routes;
