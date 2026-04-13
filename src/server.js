import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import studyRouter from "./modules/study/study.routes.js";
import habitRouter from "./modules/habit/habit.routes.js";
import focusRouter from "./modules/focus/focus.routes.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.use("/studies", studyRouter);
app.use("/studies/:studyId/habits", habitRouter);
app.use("/studies/:studyId/focus-sessions", focusRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
