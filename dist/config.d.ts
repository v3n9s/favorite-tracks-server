import { z } from "zod";
declare const configSchema: z.ZodObject<{
    accessTokenSecret: z.ZodString;
    accessTokenExpirationTime: z.ZodNumber;
    refreshTokenSecret: z.ZodString;
    refreshTokenExpirationTime: z.ZodNumber;
    databaseFilePath: z.ZodString;
    port: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    accessTokenSecret: string;
    accessTokenExpirationTime: number;
    refreshTokenSecret: string;
    refreshTokenExpirationTime: number;
    databaseFilePath: string;
    port: number;
}, {
    accessTokenSecret: string;
    accessTokenExpirationTime: number;
    refreshTokenSecret: string;
    refreshTokenExpirationTime: number;
    databaseFilePath: string;
    port: number;
}>;
export type Config = z.output<typeof configSchema>;
export declare const config: Config;
export {};
//# sourceMappingURL=config.d.ts.map