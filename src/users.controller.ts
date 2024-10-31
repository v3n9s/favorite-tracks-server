import { Router } from "express";
import { z } from "zod";
import { createHandler } from "./create-handler.js";
import { createUser, isUserExists } from "./users.service.js";
import { schemas } from "./schemas.js";

export const usersRouter = Router();

usersRouter.route("/").post(
  createHandler({
    schema: {
      body: z.object({
        name: schemas.name,
        publicName: schemas.publicName,
        password: schemas.password,
      }),
    },
    handler: async ({ res, data }) => {
      if (await isUserExists({ name: data.body.name })) {
        res.status(409).end();
        return;
      }
      await createUser({
        name: data.body.name,
        publicName: data.body.publicName,
        password: data.body.password,
      });
      res.status(200).end();
    },
  }),
);