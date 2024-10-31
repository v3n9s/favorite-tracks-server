import knex, { type Knex } from "knex";
import { config } from "./config.js";

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

export const getUniqueId = (): string => {
  return crypto.randomUUID();
};

const db = knex({
  client: "sqlite3",
  useNullAsDefault: true,
  connection: {
    filename: config.databaseFilePath,
  },
});

export const getDb = (): Knex => {
  return db;
};

type TableCreators = {
  [tableName: string]: (t: Knex.CreateTableBuilder) => unknown;
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
} satisfies TableCreators;

const initDb = async (): Promise<void> => {
  await Promise.all(
    Object.entries(tableCreators).map(async ([tableName, tableCreator]) => {
      if (!(await db.schema.hasTable(tableName))) {
        await db.schema.createTable(tableName, tableCreator);
      }
    }),
  );
};

await initDb();
