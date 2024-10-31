import { getDb, getUniqueId, type SessionDb } from "./db.js";
import { createSessionTokens, type SessionTokens } from "./token.js";

export class SessionNotFoundError extends Error {}

export const isSessionExists = async ({
  id,
}: {
  id: string;
}): Promise<boolean> => {
  try {
    await getSession({ id });
    return true;
  } catch (e) {
    if (e instanceof SessionNotFoundError) {
      return false;
    } else {
      throw e;
    }
  }
};

export const getSession = async ({
  id,
}: {
  id: string;
}): Promise<SessionDb> => {
  const db = getDb();

  const session = (
    await db<SessionDb>("sessions").limit(1).where("id", "=", id)
  )[0];
  if (!session) {
    throw new SessionNotFoundError();
  }
  return session;
};

export const createSession = async ({
  userId,
}: {
  userId: string;
}): Promise<SessionTokens> => {
  const db = getDb();
  const sessionId = getUniqueId();
  const tokens = await createSessionTokens({ userId, sessionId });

  await db<SessionDb>("sessions").insert({
    id: sessionId,
    userId,
    refreshToken: tokens.refreshToken,
  });

  return tokens;
};

export const updateSession = async ({
  id,
}: {
  id: string;
}): Promise<SessionTokens> => {
  const db = getDb();
  const session = await getSession({ id });
  const tokens = await createSessionTokens({
    sessionId: id,
    userId: session.userId,
  });

  await db<SessionDb>("sessions")
    .update({ refreshToken: tokens.refreshToken })
    .where("id", "=", id);

  return tokens;
};

export const deleteSession = async ({ id }: { id: string }): Promise<void> => {
  const db = getDb();

  await db<SessionDb>("sessions").delete().where("id", "=", id);
};
