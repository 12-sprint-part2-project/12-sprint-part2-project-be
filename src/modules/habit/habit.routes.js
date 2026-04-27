import express from "express";
import { validateId } from "../../common/middlewares/validateId.js";
import { checkStudyExists } from "../../common/middlewares/studyExist.js";
import * as habitController from "./habit.controller.js";

const router = express.Router({ mergeParams: true });

router.param("studyId", validateId); //validateId에서는 숫자로 변환, 양의 정수인지 확인, 문제 있으면 BadRequestError.
router.param("habitId", validateId);

router.use(checkStudyExists); // 이 라우터 아래의 모든 요청에 checkStudyExists를 적용

router.get("/today", habitController.getTodayHabits);
router.post("/", habitController.createHabit);
router.patch("/:habitId/today", habitController.toggleHabit);
router.patch("/:habitId", habitController.updateHabit);
router.delete("/:habitId", habitController.deleteHabit);

export default router;
