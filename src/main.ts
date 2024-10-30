import express, { json } from "express";
import { config } from "./config.js";
import { usersRouter } from "./users.controller.js";

const app = express();

app.use((req, res, next) => {
  res.removeHeader("x-powered-by");
  res.setHeader("content-type", "application/json");
  if (req.headers["content-type"] !== "application/json") {
    res.status(400).json({
      error: 'content-type header should be set to "application/json"',
    });
    return;
  }
  next();
});

app.use(json());

app.use("/users", usersRouter);

app.use("*", (req, res) => {
  res.status(404).send("{}");
});

app.listen(config.port);
