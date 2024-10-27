import { z } from "zod";

const name = z.string().min(1).max(32);

const publicName = name;

const password = z.string().min(4).max(64);

export const schemas = {
  name,
  publicName,
  password,
};
