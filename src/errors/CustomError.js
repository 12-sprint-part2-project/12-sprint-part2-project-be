import { ERROR_CODES } from "./errorCodes.js";

export class AppError extends Error {
  constructor(
    message,
    { status = 500, code = ERROR_CODES.INTERNAL_ERROR } = {},
  ) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.code = code;
  }
}

// 도메인별 NotFoundError
export class StudyNotFoundError extends AppError {
  constructor() {
    super("스터디를 찾을 수 없습니다", {
      status: 404,
      code: ERROR_CODES.STUDY_NOT_FOUND,
    });
  }
}

export class HabitNotFoundError extends AppError {
  constructor() {
    super("습관을 찾을 수 없습니다", {
      status: 404,
      code: ERROR_CODES.HABIT_NOT_FOUND,
    });
  }
}

export class HabitLogNotFoundError extends AppError {
  constructor() {
    super("습관 기록을 찾을 수 없습니다", {
      status: 404,
      code: ERROR_CODES.HABIT_LOG_NOT_FOUND,
    });
  }
}

export class FocusNotFoundError extends AppError {
  constructor() {
    super("집중 세션을 찾을 수 없습니다", {
      status: 404,
      code: ERROR_CODES.FOCUS_NOT_FOUND,
    });
  }
}

export class BadRequestError extends AppError {
  constructor(message, code = ERROR_CODES.VALIDATION_ERROR) {
    super(message, { status: 400, code });
  }
}

export class AuthenticationError extends AppError {
  constructor(message = "인증이 필요합니다") {
    super(message, { status: 401, code: ERROR_CODES.UNAUTHORIZED });
  }
}

export class ConflictError extends AppError {
  constructor(message = "이미 존재하는 리소스입니다") {
    super(message, { status: 409, code: ERROR_CODES.CONFLICT });
  }
}

export class DuplicateFocusTitleError extends AppError {
  constructor() {
    super("이미 사용 중인 집중 세션 제목입니다.", {
      status: 409,
      code: ERROR_CODES.DUPLICATE_FOCUS_TITLE,
    });
  }
}

export class FocusAlreadyCompletedError extends AppError {
  constructor() {
    super("종료된 집중 상태는 변경할 수 없습니다", {
      status: 409,
      code: ERROR_CODES.FOCUS_ALREADY_COMPLETED,
    });
  }
}
