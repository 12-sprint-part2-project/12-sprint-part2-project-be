import express from "express";
import * as habitController from "./habit.controller.js";

const router = express.Router({ mergeParams: true });

router.get("/today", habitController.getTodayHabits);
router.post("/", habitController.createHabit);
router.patch("/:habitId", habitController.updateHabit);
router.delete("/:habitId", habitController.deleteHabit);

export default router;
