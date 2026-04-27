import { BadRequestError } from "../../errors/CustomError.js";

const PARAM_LABEL = {
  studyId: "스터디 ID",
  habitId: "습관 ID",
  sessionId: "집중 세션 ID",
};

export const validateId = (req, res, next, value, name) => {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    const label = PARAM_LABEL[name] ?? name;
    return next(new BadRequestError(`${label}는 양의 정수여야 합니다`));
  }
  req.params[name] = id;
  next();
};
