import type { SessionTokens } from "./token.js";

type ErrorCode =
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

type ErrorBody = {
  success: false;
  code: ErrorCode;
};

type SuccessCodes = {
  UserCreated: null;
  SessionCreated: SessionTokens;
  SessionUpdated: SessionTokens;
  SessionDeleted: null;
};

type SuccessCode = keyof SuccessCodes;

type SuccessBody = {
  success: true;
  code: SuccessCode;
  payload: unknown;
};

export const createErrorBody = (code: ErrorCode): ErrorBody => {
  return {
    success: false,
    code,
  };
};

export const createSuccessBody = <C extends SuccessCode>(
  code: C,
  payload: SuccessCodes[C],
): SuccessBody => {
  return {
    success: true,
    code,
    payload,
  };
};
