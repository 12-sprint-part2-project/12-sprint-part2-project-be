import * as studyService from "./study.service.js";
import asyncHandler from "../../common/middlewares/asyncHandler.js";

export const getStudies = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "TODO" });
});

export const createStudy = asyncHandler(async (req, res) => {
  res.status(201).json({ message: "TODO" });
});

export const getStudyById = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "TODO" });
});

export const updateStudy = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "TODO" });
});

export const deleteStudy = asyncHandler(async (req, res) => {
  res.status(204).send();
});

export const verifyPassword = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "TODO" });
});

export const addEmoji = asyncHandler(async (req, res) => {
  res.status(201).json({ message: "TODO" });
});
