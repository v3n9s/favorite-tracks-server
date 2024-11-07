import { z } from "zod";
const id = z.string().uuid();
const name = z.string().min(1).max(32);
const publicName = name;
const password = z.string().min(4).max(64);
const token = z.string();
const authorizationHeader = z.string().startsWith("Bearer ");
export const schemas = {
    id,
    name,
    publicName,
    password,
    token,
    authorizationHeader,
};
//# sourceMappingURL=schemas.js.map