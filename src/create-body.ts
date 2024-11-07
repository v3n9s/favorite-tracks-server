import type {
  ErrorBody,
  ErrorCode,
  SuccessBody,
  SuccessCode,
  SuccessCodes,
} from "./response-body.js";

export const createErrorBody = <C extends ErrorCode>(code: C): ErrorBody<C> => {
  return {
    success: false,
    code,
  };
};

export const createSuccessBody = <C extends SuccessCode>(
  code: C,
  payload: SuccessCodes[C],
): SuccessBody<C> => {
  return {
    success: true,
    code,
    payload,
  };
};
