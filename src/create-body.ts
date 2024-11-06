import type {
  ErrorBody,
  ErrorCode,
  SuccessBody,
  SuccessCode,
  SuccessCodes,
} from "./response-bodies.js";

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
