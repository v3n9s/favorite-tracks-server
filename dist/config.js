import { z } from "zod";
const safeUint = z
    .number({ coerce: true })
    .int()
    .min(0)
    .max(Number.MAX_SAFE_INTEGER);
const configSchema = z.object({
    accessTokenSecret: z.string(),
    accessTokenExpirationTime: safeUint,
    refreshTokenSecret: z.string(),
    refreshTokenExpirationTime: safeUint,
    databaseFilePath: z.string(),
    port: safeUint,
});
const configParseResult = configSchema.safeParse(process.env);
if (configParseResult.error) {
    console.error("error occured during config validation");
    console.log(configParseResult.error.issues);
    process.exit(1);
}
export const config = configParseResult.data;
//# sourceMappingURL=config.js.map