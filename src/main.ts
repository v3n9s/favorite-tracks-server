import express, { json } from "express";
import { config } from "./config.js";

const app = express();

app.use(json());

app.use((req, res, next) => {
  res.removeHeader("x-powered-by");
  res.setHeader("content-type", "application/json");
  next();
});

app.use("*", (req, res) => {
  res.status(404).send("{}");
});

app.listen(config.port);
