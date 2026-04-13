import express from "express";
import * as focusController from "./focus.controller.js";

const router = express.Router({ mergeParams: true });

router.get("/", focusController.getSession);
router.post("/", focusController.createSession);
router.patch("/:sessionId", focusController.updateSession);

export default router;
