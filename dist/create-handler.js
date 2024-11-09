import * as jose from "jose";
import { z } from "zod";
import { schemas } from "./schemas.js";
import { verifyAccessToken } from "./token.js";
import { getUserWithSession, isUserExists } from "./users.service.js";
import { isSessionExists } from "./sessions.service.js";
import { createErrorBody } from "./create-body.js";
export const createHandler = ({ schema, requireAuthentication = false, handler, }) => {
    return (req, res) => {
        (async () => {
            let user;
            if (requireAuthentication) {
                let token;
                try {
                    const authorizationHeader = await schemas.authorizationHeader.parseAsync(req.headers.authorization);
                    token = authorizationHeader.slice("Bearer ".length);
                }
                catch (e) {
                    if (e instanceof z.ZodError) {
                        res.status(401).json(createErrorBody("AuthorizationHeaderFormat"));
                        return;
                    }
                    throw e;
                }
                let userId;
                let sessionId;
                try {
                    const { payload } = await verifyAccessToken(token);
                    userId = payload.userId;
                    sessionId = payload.sessionId;
                }
                catch (e) {
                    if (e instanceof jose.errors.JWSSignatureVerificationFailed) {
                        res.status(401).json(createErrorBody("TokenSignatureInvalid"));
                        return;
                    }
                    else if (e instanceof jose.errors.JWTExpired) {
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
            }
            else {
                user = {};
            }
            try {
                const data = await schema?.parseAsync(req);
                await handler({ req, res, data, user });
            }
            catch (e) {
                if (e instanceof z.ZodError) {
                    res.status(400).json(createErrorBody("ValidationError"));
                }
            }
        })().catch(() => {
            res.status(500).json(createErrorBody("InternalError"));
        });
    };
};
//# sourceMappingURL=create-handler.js.map