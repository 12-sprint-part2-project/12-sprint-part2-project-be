import express from "express";
import * as habitController from "./habit.controller.js";

const router = express.Router({ mergeParams: true });

router.get("/", habitController.getWeeklyLogs); // ?date=YYYY-MM-DD

export default router;
