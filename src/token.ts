import * as jose from "jose";
import { config } from "./config.js";
import type { SessionIds, SessionTokens, TokenPayload } from "./types.js";

const accessTokenKey = new Uint8Array(Buffer.from(config.accessTokenSecret));
const refreshTokenKey = new Uint8Array(Buffer.from(config.refreshTokenSecret));

const convertMsToS = (n: number): number => {
  return Math.floor(n / 1000);
};

const generateToken = ({
  sessionId,
  userId,
  expireInSeconds,
  key,
}: SessionIds & {
  expireInSeconds: number;
  key: Uint8Array;
}): Promise<string> => {
  const nowSeconds = convertMsToS(Date.now());
  return new jose.SignJWT({
    sessionId,
    userId,
    iat: nowSeconds,
    exp: nowSeconds + expireInSeconds,
  } satisfies TokenPayload)
    .setProtectedHeader({ typ: "JWT", alg: "HS512" })
    .sign(key);
};

export const createSessionTokens = async ({
  sessionId,
  userId,
}: SessionIds): Promise<SessionTokens> => {
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

type VerifyTokenResult = Promise<jose.JWTVerifyResult<TokenPayload>>;

const verifyToken = async (
  token: string,
  key: Uint8Array,
): VerifyTokenResult => {
  return jose.jwtVerify(token, key, { typ: "JWT", algorithms: ["HS512"] });
};

export const verifyAccessToken = async (token: string): VerifyTokenResult => {
  return verifyToken(token, accessTokenKey);
};

export const verifyRefreshToken = async (token: string): VerifyTokenResult => {
  return verifyToken(token, refreshTokenKey);
};
