import knex, {} from "knex";
import { config } from "./config.js";
export const getUniqueId = () => {
    return crypto.randomUUID();
};
const db = knex({
    client: "sqlite3",
    useNullAsDefault: true,
    connection: {
        filename: config.databaseFilePath,
    },
});
export const getDb = () => {
    return db;
};
const tableCreators = {
    users: (t) => {
        t.text("id").notNullable().primary();
        t.text("name").notNullable().unique();
        t.text("publicName").notNullable();
    },
    passwords: (t) => {
        t.text("userId").notNullable().primary();
        t.text("password").notNullable();
    },
    sessions: (t) => {
        t.text("id").notNullable().primary();
        t.text("userId").notNullable();
        t.text("refreshToken").notNullable();
    },
};
const initDb = async () => {
    await Promise.all(Object.entries(tableCreators).map(async ([tableName, tableCreator]) => {
        if (!(await db.schema.hasTable(tableName))) {
            await db.schema.createTable(tableName, tableCreator);
        }
    }));
};
await initDb();
//# sourceMappingURL=db.js.map