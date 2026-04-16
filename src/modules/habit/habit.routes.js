import express from "express";
import { validateId } from "../middlewares/validateId.js";
import * as habitController from "./habit.controller.js";

const router = express.Router({ mergeParams: true });

router.param("studyId", validateId);
router.param("habitId", validateId);

router.get("/today", habitController.getTodayHabits);
router.post("/", habitController.createHabit);
router.patch("/:habitId/today", habitController.toggleHabit);
router.patch("/:habitId", habitController.updateHabit);
router.delete("/:habitId", habitController.deleteHabit);

export default router;
