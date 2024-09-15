import express from "express";

import authRouter from "./routes/authRouter.js";
import config from "./config.js";
import usersRouter from "./routes/usersRouter.js";
import { validateAccessToken } from "./utils/auth.js";

const app = express();

app.use(express.json());
app.use(validateAccessToken);

// ---------- ROUTES ----------
app.use("/auth/", authRouter);
app.use("/users/", usersRouter);

// ---------- ERROR HANDLING ----------
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    // You can't just remove `next` parameter, because it's the error handler middleware
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: express.NextFunction,
  ) => {
    console.error(err);
    res.status(500).send("Internal Server Error");
  },
);

// ---------- SERVER START ----------

app.listen(config.SERVER_PORT, () =>
  console.log(`app listening on port ${config.SERVER_PORT}!`),
);
