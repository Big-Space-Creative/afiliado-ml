import express from "express";
import { requireAuth } from "../middlewares/auth.js";
import { updateMlCookie } from "../controllers/cookieController.js";

const router = express.Router();

router.post("/ml-cookie", requireAuth, updateMlCookie);

export default router;
