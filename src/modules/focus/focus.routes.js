import express from "express";
import { validateId } from "../middlewares/validateId.js";
import * as focusController from "./focus.controller.js";

const router = express.Router({ mergeParams: true });

router.param("studyId", validateId);
router.param("sessionId", validateId);

router.get("/", focusController.getSession);
router.post("/", focusController.createSession);
router.patch("/:sessionId", focusController.updateSession);

export default router;
