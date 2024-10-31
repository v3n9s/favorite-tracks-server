import { z } from "zod";

const name = z.string().min(1).max(32);

const publicName = name;

const password = z.string().min(4).max(64);

const authorizationHeader = z.string().startsWith("Bearer ");

export const schemas = {
  name,
  publicName,
  password,
  authorizationHeader,
};
