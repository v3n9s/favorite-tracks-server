import type { Request, Response } from "express";
import * as jose from "jose";
import { z } from "zod";
import { schemas } from "./schemas.js";
import type { UserWithSessionDb } from "./db.js";
import { verifyAccessToken } from "./token.js";
import { getUserWithSession, isUserExists } from "./users.service.js";
import { isSessionExists } from "./sessions.service.js";
import { createErrorBody } from "./create-body.js";

// generic type prevents type inference by accepting function
export type ExpressRequestHandlerNoInfer = <
  _, // eslint-disable-line @typescript-eslint/no-unnecessary-type-parameters, @typescript-eslint/no-unused-vars
>(
  req: Request,
  res: Response,
) => void;

export type CreateHandlerFn = <
  Schema extends z.ZodType<unknown>,
  RA extends boolean = false,
>(arg: {
  schema: Schema;
  requireAuthentication?: RA;
  handler: (
    args: {
      req: Request;
      res: Response;
      data: z.output<Schema>;
    } & (RA extends true ? { user: UserWithSessionDb } : unknown),
  ) => Promise<void> | void;
}) => ExpressRequestHandlerNoInfer;

export const createHandler: CreateHandlerFn = ({
  schema,
  requireAuthentication = false,
  handler,
}) => {
  return (req, res) => {
    (async () => {
      let user: UserWithSessionDb;
      if (requireAuthentication) {
        let token: string;
        try {
          const authorizationHeader =
            await schemas.authorizationHeader.parseAsync(
              req.headers.authorization,
            );
          token = authorizationHeader.slice("Bearer ".length);
        } catch (e) {
          if (e instanceof z.ZodError) {
            res.status(401).json(createErrorBody("AuthorizationHeaderFormat"));
            return;
          }
          throw e;
        }

        let userId: string;
        let sessionId: string;
        try {
          const { payload } = await verifyAccessToken(token);
          userId = payload.userId;
          sessionId = payload.sessionId;
        } catch (e) {
          if (e instanceof jose.errors.JWSSignatureVerificationFailed) {
            res.status(401).json(createErrorBody("TokenSignatureInvalid"));
            return;
          } else if (e instanceof jose.errors.JWTExpired) {
            res.status(401).json(createErrorBody("TokenExpired"));
            return;
          }
          throw e;
        }

        if (!(await isSessionExists({ id: sessionId }))) {
          res.status(401).json(createErrorBody("SessionNotFound"));
          return;
        }

        if (!(await isUserExists({ id: userId }))) {
          res.status(401).json(createErrorBody("SessionUserNotFound"));
          return;
        }

        user = await getUserWithSession({ id: userId, sessionId });
      } else {
        user = {} as UserWithSessionDb;
      }

      try {
        const data = await schema.parseAsync(req);
        await handler({ req, res, data, user });
      } catch (e) {
        if (e instanceof z.ZodError) {
          res.status(400).json(createErrorBody("ValidationError"));
        }
      }
    })().catch(() => {
      res.status(500).json(createErrorBody("InternalError"));
    });
  };
};
