import { Router } from "express";
import { createHandler } from "./create-handler.js";
import {
  createSession,
  deleteSession,
  getSession,
  isSessionExists,
  updateSession,
} from "./sessions.service.js";
import { z } from "zod";
import { schemas } from "./schemas.js";
import { getUserWithPassword, isUserExists } from "./users.service.js";
import { verifyHash } from "./hash.js";
import { verifyRefreshToken } from "./token.js";

export const sessionsRouter = Router();

sessionsRouter.route("/*").all((req, res, next) => {
  res.setHeader("cache-control", "no-store");
  next();
});

sessionsRouter
  .route("/")
  .post(
    createHandler({
      schema: z.object({
        body: z.object({
          name: schemas.name,
          password: schemas.password,
        }),
      }),
      handler: async ({ res, data }) => {
        if (!(await isUserExists({ name: data.body.name }))) {
          res.status(404).send();
          return;
        }
        const user = await getUserWithPassword({ name: data.body.name });
        if (!(await verifyHash(user.password, data.body.password))) {
          res.status(401).send();
          return;
        }
        res.status(200).send(await createSession({ userId: user.id }));
      },
    }),
  )
  .put(
    createHandler({
      schema: z.object({
        body: z.object({
          refreshToken: schemas.token,
        }),
      }),
      handler: async ({ res, data }) => {
        const {
          payload: { sessionId, userId },
        } = await verifyRefreshToken(data.body.refreshToken);
        if (
          !(await isSessionExists({ id: sessionId })) ||
          !(await isUserExists({ id: userId }))
        ) {
          res.status(404).end();
          return;
        }
        res.status(200).send(updateSession({ id: sessionId }));
      },
    }),
  );

sessionsRouter.route("/:id").delete(
  createHandler({
    schema: z.object({
      params: z.object({
        id: schemas.id,
      }),
    }),
    requireAuthentication: true,
    handler: async ({ res, data, user }) => {
      if (!(await isSessionExists({ id: data.params.id }))) {
        res.status(404).end();
        return;
      }
      if ((await getSession({ id: data.params.id })).userId !== user.id) {
        res.status(403).end();
        return;
      }
      await deleteSession({ id: data.params.id });
      res.status(200).end();
    },
  }),
);
