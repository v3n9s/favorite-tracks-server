import type { ErrorBody, ErrorCode, SuccessBody, SuccessCode, SuccessCodes } from "./response-body.js";
export declare const createErrorBody: <C extends ErrorCode>(code: C) => ErrorBody<C>;
export declare const createSuccessBody: <C extends SuccessCode>(code: C, payload: SuccessCodes[C]) => SuccessBody<C>;
//# sourceMappingURL=create-body.d.ts.map