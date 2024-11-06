import type { SessionTokens } from "./token.js";

export type ErrorCode =
  | "UserAlreadyExists"
  | "UserNotFound"
  | "UserPassword"
  | "AuthorizationHeaderFormat"
  | "TokenSignatureInvalid"
  | "TokenExpired"
  | "SessionNotFound"
  | "SessionUserNotFound"
  | "SessionUserMismatch"
  | "ValidationError"
  | "InternalError"
  | "ContentTypeApplicationJsonRequired"
  | "NotFound";

export type ErrorBody = {
  success: false;
  code: ErrorCode;
};

export type SuccessCodes = {
  UserCreated: null;
  SessionCreated: SessionTokens;
  SessionUpdated: SessionTokens;
  SessionDeleted: null;
};

export type SuccessCode = keyof SuccessCodes;

export type SuccessBody = {
  success: true;
  code: SuccessCode;
  payload: unknown;
};
