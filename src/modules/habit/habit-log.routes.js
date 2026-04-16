import express from "express";
import { validateId } from "../../common/middlewares/validateId.js";
import * as habitController from "./habit.controller.js";

const router = express.Router({ mergeParams: true });

router.param("studyId", validateId);

router.get("/", habitController.getWeeklyLogs); // ?date=YYYY-MM-DD

export default router;
