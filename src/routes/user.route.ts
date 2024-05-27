import { Request, Response } from "express";
import controller from "../controllers/user.controller";
import User from "../models/user";

const { Router } = require("express");
const router = Router();

// Crear usuario
router.post("/signUp", controller.registerUser);

// Iniciar sesión
router.post("/login", controller.login);

export default router;
