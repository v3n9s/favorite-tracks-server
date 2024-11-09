import { type UserDb, type UserWithPasswordDb, type UserWithSessionDb } from "./db.js";
type IdOrNameObject = {
    id: string;
    name?: never;
} | {
    id?: never;
    name: string;
};
export declare class UserNotFoundError extends Error {
}
export declare class UserPasswordNotFoundError extends Error {
}
export declare class UserAlreadyExistsError extends Error {
}
export declare const isUserExists: (args: IdOrNameObject) => Promise<boolean>;
export declare const getUser: (args: IdOrNameObject) => Promise<UserDb>;
export declare const getUserWithPassword: (args: IdOrNameObject) => Promise<UserWithPasswordDb>;
export declare const getUserWithSession: (args: IdOrNameObject & {
    sessionId: string;
}) => Promise<UserWithSessionDb>;
export declare const createUser: ({ name, publicName, password, }: {
    name: string;
    publicName: string;
    password: string;
}) => Promise<boolean>;
export {};
//# sourceMappingURL=users.service.d.ts.map