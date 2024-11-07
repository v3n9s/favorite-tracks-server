import { getDb, getUniqueId } from "./db.js";
import { createSessionTokens } from "./token.js";
export class SessionNotFoundError extends Error {
}
export const isSessionExists = async ({ id, }) => {
    try {
        await getSession({ id });
        return true;
    }
    catch (e) {
        if (e instanceof SessionNotFoundError) {
            return false;
        }
        else {
            throw e;
        }
    }
};
export const getSession = async ({ id, }) => {
    const db = getDb();
    const session = (await db("sessions").limit(1).where("id", "=", id))[0];
    if (!session) {
        throw new SessionNotFoundError();
    }
    return session;
};
export const createSession = async ({ userId, }) => {
    const db = getDb();
    const sessionId = getUniqueId();
    const tokens = await createSessionTokens({ userId, sessionId });
    await db("sessions").insert({
        id: sessionId,
        userId,
        refreshToken: tokens.refreshToken,
    });
    return tokens;
};
export const updateSession = async ({ id, }) => {
    const db = getDb();
    const session = await getSession({ id });
    const tokens = await createSessionTokens({
        sessionId: id,
        userId: session.userId,
    });
    await db("sessions")
        .update({ refreshToken: tokens.refreshToken })
        .where("id", "=", id);
    return tokens;
};
export const deleteSession = async ({ id }) => {
    const db = getDb();
    await db("sessions").delete().where("id", "=", id);
};
//# sourceMappingURL=sessions.service.js.map