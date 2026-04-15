import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import studyRouter from "./modules/study/study.routes.js";
import habitRouter from "./modules/habit/habit.routes.js";
import habitLogRouter from "./modules/habit/habit-log.routes.js";
import focusRouter from "./modules/focus/focus.routes.js";
import errorHandler from "./common/middlewares/errorHandler.js";
import session from "express-session";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

/* 세션을 사용하기 위한 설정 */
app.use(
  session({
    secret: process.env.SESSION_SECRET || "part2-team3-key", // 세션 암호화 키
    resave: false, // 세션 수정사항이 없어도 다시 저장할지 여부
    saveUninitialized: false, // 초기화되지 않은 세션을 저장할지 여부 (보통 false 권장)
    cookie: {
      httpOnly: true, // 자바스크립트로 쿠키 접근 방지 (보안!)
      secure: false, // 배포 전(HTTP)에는 false로 설정
      maxAge: 1000 * 60 * 60, // 쿠키 유효 시간 (현재 1시간 설정)
    },
  }),
);

app.use("/studies", studyRouter);
app.use("/studies/:studyId/habits", habitRouter);
app.use("/studies/:studyId/habit-logs", habitLogRouter);
app.use("/studies/:studyId/focus-sessions", focusRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
