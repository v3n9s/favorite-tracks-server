import { getDb, getUniqueId, } from "./db.js";
import { getHash } from "./hash.js";
import { getSession } from "./sessions.service.js";
export class UserNotFoundError extends Error {
}
export class UserPasswordNotFoundError extends Error {
}
export class UserAlreadyExistsError extends Error {
}
export const isUserExists = async (args) => {
    try {
        await getUser(args);
        return true;
    }
    catch (e) {
        if (e instanceof UserNotFoundError) {
            return false;
        }
        else {
            throw e;
        }
    }
};
export const getUser = async (args) => {
    const db = getDb();
    let query = db("users").limit(1);
    if ("id" in args) {
        query = query.where("id", "=", args.id);
    }
    else {
        query = query.where("name", "=", args.name);
    }
    const user = (await query)[0];
    if (!user) {
        throw new UserNotFoundError();
    }
    return user;
};
export const getUserWithPassword = async (args) => {
    const db = getDb();
    const user = await getUser(args);
    const passwordEntry = (await db("passwords").limit(1).where("userId", "=", user.id))[0];
    if (!passwordEntry) {
        throw new UserPasswordNotFoundError();
    }
    return { ...user, password: passwordEntry.password };
};
export const getUserWithSession = async (args) => {
    const user = await getUser(args);
    const session = await getSession({ id: args.sessionId });
    return { ...user, session };
};
export const createUser = async ({ name, publicName, password, }) => {
    if (await isUserExists({ name })) {
        throw new UserAlreadyExistsError();
    }
    const db = getDb();
    const id = getUniqueId();
    await db.transaction(async (transaction) => {
        await transaction("users").insert({ id, name, publicName });
        await transaction("passwords").insert({
            userId: id,
            password: await getHash(password),
        });
    });
    return true;
};
//# sourceMappingURL=users.service.js.map