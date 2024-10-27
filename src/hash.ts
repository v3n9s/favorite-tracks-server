import argon2 from "argon2";

const argonOptions: argon2.Options = {
  hashLength: 64,
  memoryCost: 64 * 1024,
  parallelism: 4,
  timeCost: 8,
  type: argon2.argon2i,
};

export const getHash = (password: string): Promise<string> => {
  return argon2.hash(password, argonOptions);
};

export const verifyHash = (
  hash: string,
  password: string,
): Promise<boolean> => {
  return argon2.verify(hash, password);
};
