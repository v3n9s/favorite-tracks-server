import * as jose from "jose";
import type { SessionIds, SessionTokens, TokenPayload } from "./types.js";
export declare const createSessionTokens: ({ sessionId, userId, }: SessionIds) => Promise<SessionTokens>;
type VerifyTokenResult = Promise<jose.JWTVerifyResult<TokenPayload>>;
export declare const verifyAccessToken: (token: string) => VerifyTokenResult;
export declare const verifyRefreshToken: (token: string) => VerifyTokenResult;
export {};
//# sourceMappingURL=token.d.ts.map