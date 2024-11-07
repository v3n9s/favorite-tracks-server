import argon2 from "argon2";
const argonOptions = {
    hashLength: 64,
    memoryCost: 64 * 1024,
    parallelism: 4,
    timeCost: 8,
    type: argon2.argon2i,
};
export const getHash = (password) => {
    return argon2.hash(password, argonOptions);
};
export const verifyHash = (hash, password) => {
    return argon2.verify(hash, password);
};
//# sourceMappingURL=hash.js.map