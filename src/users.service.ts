import {
  getDb,
  getUniqueId,
  type PasswordDb,
  type UserDb,
  type UserWithPasswordDb,
} from "./db.js";
import { getHash } from "./hash.js";

type IdOrNameObject =
  | { id: string; name?: never }
  | { id?: never; name: string };

export class UserNotFoundError extends Error {}

export class UserPasswordNotFoundError extends Error {}

export class UserAlreadyExistsError extends Error {}

export const isUserExists = async (args: IdOrNameObject): Promise<boolean> => {
  try {
    await getUser(args);
    return true;
  } catch (e) {
    if (e instanceof UserNotFoundError) {
      return false;
    } else {
      throw e;
    }
  }
};

export const getUser = async (args: IdOrNameObject): Promise<UserDb> => {
  const db = getDb();

  let query = db<UserDb>("users").limit(1);
  if ("id" in args) {
    query = query.where("id", "=", args.id);
  } else {
    query = query.where("name", "=", args.name);
  }

  const user = (await query)[0];
  if (!user) {
    throw new UserNotFoundError();
  }
  return user;
};

export const getUserWithPassword = async (
  args: IdOrNameObject,
): Promise<UserWithPasswordDb> => {
  const db = getDb();

  const user = await getUser(args);
  const passwordEntry = (
    await db<PasswordDb>("passwords").limit(1).where("userId", "=", user.id)
  )[0];
  if (!passwordEntry) {
    throw new UserPasswordNotFoundError();
  }

  return { ...user, password: passwordEntry.password };
};

export const createUser = async ({
  name,
  publicName,
  password,
}: {
  name: string;
  publicName: string;
  password: string;
}): Promise<boolean> => {
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
