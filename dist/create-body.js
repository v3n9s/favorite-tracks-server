export const createErrorBody = (code) => {
    return {
        success: false,
        code,
    };
};
export const createSuccessBody = (code, payload) => {
    return {
        success: true,
        code,
        payload,
    };
};
//# sourceMappingURL=create-body.js.map