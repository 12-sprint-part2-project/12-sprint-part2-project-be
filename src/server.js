import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import studyRouter from "./modules/study/study.routes.js";
import habitRouter from "./modules/habit/habit.routes.js";
import habitLogRouter from "./modules/habit/habit-log.routes.js";
import focusRouter from "./modules/focus/focus.routes.js";
import errorHandler from "./common/middlewares/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.set("trust proxy", 1);

const allowedOrigins = [
  "http://localhost:5173",
  "https://forest-of-study.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // origin이 없거나(Postman 등) 목록에 있으면 허용
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());

app.use("/studies", studyRouter);
app.use("/studies/:studyId/habits", habitRouter);
app.use("/studies/:studyId/habit-logs", habitLogRouter);
app.use("/studies/:studyId/focus-sessions", focusRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
