export type SessionIds = {
  sessionId: string;
  userId: string;
};

export type SessionTokens = {
  accessToken: string;
  refreshToken: string;
};

export type TokenPayload = SessionIds & {
  iat: number;
  exp: number;
};
