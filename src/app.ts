import express from "express";
import taskRoutes from "./routes/task.routes";
import { logger } from "./middlewares/logger";
import { errorMiddleware } from "./middlewares/error-handlers/error-middleware";
const app = express();

app.use(express.json());
app.use(logger);
app.use("/api", taskRoutes);
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    errorMiddleware(err, req, res, next);
  }
);

export default app;
