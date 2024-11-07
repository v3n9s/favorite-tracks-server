import type { SessionTokens } from "./types.js";

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

export type ErrorBody<C extends ErrorCode = ErrorCode> = {
  success: false;
  code: C;
};

export type SuccessCodes = {
  CORSRequestAllowed: null;
  UserCreated: null;
  SessionCreated: SessionTokens;
  SessionUpdated: SessionTokens;
  SessionDeleted: null;
};

export type SuccessCode = keyof SuccessCodes;

export type SuccessBody<C extends SuccessCode = SuccessCode> = {
  success: true;
  code: C;
  payload: SuccessCodes[C];
};
