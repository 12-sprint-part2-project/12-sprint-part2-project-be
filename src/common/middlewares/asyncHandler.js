import {
  StudyNotFoundError,
  HabitNotFoundError,
  HabitLogNotFoundError,
  FocusNotFoundError,
} from "../../errors/CustomError.js";

const PRISMA_P2025_MAP = {
  study: StudyNotFoundError,
  habit: HabitNotFoundError,
  habitlog: HabitLogNotFoundError,
  focussession: FocusNotFoundError,
};

const normalize = (name = "") => name.toLowerCase();

const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (err) {
    if (err.code === "P2025") {
      const modelName = normalize(err.meta?.modelName);
      // meta: { modelName: 'Study', operation: 'a query' },

      const ErrorClass = PRISMA_P2025_MAP[modelName];

      return next(ErrorClass ? new ErrorClass() : err);
    }

    next(err);
  }
};

export default asyncHandler;
