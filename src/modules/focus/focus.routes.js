import express from "express";
import { validateId } from "../../common/middlewares/validateId.js";
import { checkStudyExists } from "../../common/middlewares/studyExist.js";
import * as focusController from "./focus.controller.js";

const router = express.Router({ mergeParams: true });

router.param("studyId", validateId);
router.param("sessionId", validateId);

router.use(checkStudyExists);

router.get("/", focusController.getSessions);
router.post("/", focusController.createSession);
router.patch("/:sessionId", focusController.updateSession);

export default router;
