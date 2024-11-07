import { type SessionDb } from "./db.js";
import type { SessionTokens } from "./types.js";
export declare class SessionNotFoundError extends Error {
}
export declare const isSessionExists: ({ id, }: {
    id: string;
}) => Promise<boolean>;
export declare const getSession: ({ id, }: {
    id: string;
}) => Promise<SessionDb>;
export declare const createSession: ({ userId, }: {
    userId: string;
}) => Promise<SessionTokens>;
export declare const updateSession: ({ id, }: {
    id: string;
}) => Promise<SessionTokens>;
export declare const deleteSession: ({ id }: {
    id: string;
}) => Promise<void>;
//# sourceMappingURL=sessions.service.d.ts.map