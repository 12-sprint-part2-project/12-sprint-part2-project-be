import express from "express";
import * as studyController from "./study.controller.js";

const router = express.Router();

router.get("/", studyController.getStudies);
router.post("/", studyController.createStudy);
router.get("/:id", studyController.getStudyById);
router.patch("/:id", studyController.updateStudy);
router.delete("/:id", studyController.deleteStudy);
router.post("/:id/verify-password", studyController.verifyPassword);
router.post("/:id/emojis", studyController.addEmoji);

export default router;
