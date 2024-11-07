import type { Request, Response } from "express";
import { z } from "zod";
import type { UserWithPasswordDb } from "./db.js";
export type ExpressRequestHandlerNoInfer = <_>(req: Request, res: Response) => void;
export type CreateHandlerFn = <Schema extends z.ZodType<unknown>, RA extends boolean = false>(arg: {
    schema: Schema;
    requireAuthentication?: RA;
    handler: (args: {
        req: Request;
        res: Response;
        data: z.output<Schema>;
    } & (RA extends true ? {
        user: UserWithPasswordDb;
    } : unknown)) => Promise<void> | void;
}) => ExpressRequestHandlerNoInfer;
export declare const createHandler: CreateHandlerFn;
//# sourceMappingURL=create-handler.d.ts.map