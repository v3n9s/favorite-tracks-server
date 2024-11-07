import { type Knex } from "knex";
export type UserDb = {
    id: string;
    name: string;
    publicName: string;
};
export type PasswordDb = {
    userId: string;
    password: string;
};
export type UserWithPasswordDb = UserDb & Pick<PasswordDb, "password">;
export type SessionDb = {
    id: string;
    userId: string;
    refreshToken: string;
};
export declare const getUniqueId: () => string;
export declare const getDb: () => Knex;
//# sourceMappingURL=db.d.ts.map