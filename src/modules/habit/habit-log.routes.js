import express from "express";
import { validateId } from "../../common/middlewares/validateId.js";
import { checkStudyExists } from "../../common/middlewares/studyExist.js";
import * as habitController from "./habit.controller.js";

const router = express.Router({ mergeParams: true });

router.param("studyId", validateId);
router.param("habitId", validateId);

router.use(checkStudyExists);

router.get("/", habitController.getWeeklyLogs); // ?date=YYYY-MM-DD

export default router;
