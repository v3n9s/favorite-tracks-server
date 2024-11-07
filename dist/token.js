import * as jose from "jose";
import { config } from "./config.js";
const accessTokenKey = new Uint8Array(Buffer.from(config.accessTokenSecret));
const refreshTokenKey = new Uint8Array(Buffer.from(config.refreshTokenSecret));
const convertMsToS = (n) => {
    return Math.floor(n / 1000);
};
const generateToken = ({ sessionId, userId, expireInSeconds, key, }) => {
    const nowSeconds = convertMsToS(Date.now());
    return new jose.SignJWT({
        sessionId,
        userId,
        iat: nowSeconds,
        exp: nowSeconds + expireInSeconds,
    })
        .setProtectedHeader({ typ: "JWT", alg: "HS512" })
        .sign(key);
};
export const createSessionTokens = async ({ sessionId, userId, }) => {
    return {
        accessToken: await generateToken({
            sessionId,
            userId,
            expireInSeconds: config.accessTokenExpirationTime,
            key: accessTokenKey,
        }),
        refreshToken: await generateToken({
            sessionId,
            userId,
            expireInSeconds: config.refreshTokenExpirationTime,
            key: refreshTokenKey,
        }),
    };
};
const verifyToken = async (token, key) => {
    return jose.jwtVerify(token, key, { typ: "JWT", algorithms: ["HS512"] });
};
export const verifyAccessToken = async (token) => {
    return verifyToken(token, accessTokenKey);
};
export const verifyRefreshToken = async (token) => {
    return verifyToken(token, refreshTokenKey);
};
//# sourceMappingURL=token.js.map