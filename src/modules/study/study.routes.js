import express from "express";
import { validateId } from "../../common/middlewares/validateId.js";
import * as studyController from "./study.controller.js";

const router = express.Router();

router.param("studyId", validateId);

router.get("/", studyController.getStudies);
router.post("/", studyController.createStudy);
router.get("/:studyId", studyController.getStudyById);
router.patch("/:studyId", studyController.updateStudy);
router.delete("/:studyId", studyController.deleteStudy);
router.post("/:studyId/verify-password", studyController.verifyPassword);
router.get("/:studyId/check-session", studyController.checkSession);
router.post("/:studyId/emojis", studyController.addEmoji);

export default router;
