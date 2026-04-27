import { ERROR_CODES } from "../../errors/errorCodes.js";
import { AppError } from "../../errors/CustomError.js";

const PRISMA_ERROR_MAP = {
  P2003: {
    status: 400,
    code: ERROR_CODES.INTERNAL_ERROR,
    message: "참조하는 리소스가 존재하지 않습니다",
  },
  P2002: {
    status: 409,
    code: ERROR_CODES.CONFLICT,
    message: "이미 존재하는 리소스입니다",
  },
};

const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Prisma 에러 일괄 처리
  if (PRISMA_ERROR_MAP[err.code]) {
    const { status, code, message } = PRISMA_ERROR_MAP[err.code];
    return res.status(status).json({ success: false, code, message });
  }

  // 개발자가 직접 던진 커스텀 에러 (NotFoundError, BadRequestError 등)
  if (err instanceof AppError) {
    return res.status(err.status).json({
      success: false,
      code: err.code,
      message: err.message,
    });
  }

  // 그 외 서버 에러
  res.status(500).json({
    success: false,
    code: ERROR_CODES.INTERNAL_ERROR,
    message: "서버에서 오류가 발생했습니다",
  });
};

export default errorHandler;
