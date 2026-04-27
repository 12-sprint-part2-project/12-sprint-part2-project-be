import express from "express";
import { validateId } from "../../common/middlewares/validateId.js";
import { checkStudyExists } from "../../common/middlewares/studyExist.js";
import * as studyController from "./study.controller.js";

const router = express.Router();

router.param("studyId", validateId);

router.get("/", studyController.getStudies);
router.get("/recent", studyController.getRecentStudies);
router.post("/", studyController.createStudy);
router.get("/:studyId", checkStudyExists, studyController.getStudyById);
router.patch("/:studyId", checkStudyExists, studyController.updateStudy);
router.delete("/:studyId", checkStudyExists, studyController.deleteStudy);
router.post(
  "/:studyId/verify-password",
  checkStudyExists,
  studyController.verifyPassword,
);
router.get(
  "/:studyId/check-session",
  checkStudyExists,
  studyController.checkSession,
);
router.get("/:studyId/emojis", checkStudyExists, studyController.getEmoji);
router.post("/:studyId/emojis", checkStudyExists, studyController.addEmoji);

export default router;
