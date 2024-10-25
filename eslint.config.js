// @ts-check
import path from "node:path";
import url from "node:url";
import tseslint from "typescript-eslint";

export default tseslint.config({
  files: ["src/**/*.ts", "eslint.config.js"],
  extends: [
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylistic,
  ],
  languageOptions: {
    parserOptions: {
      projectService: {
        allowDefaultProject: ["eslint.config.js"],
      },
      tsconfigRootDir: path.dirname(url.fileURLToPath(import.meta.url)),
    },
  },
  rules: {
    // stylistic
    "@typescript-eslint/consistent-indexed-object-style": [
      "error",
      "index-signature",
    ],
    "@typescript-eslint/consistent-type-definitions": ["error", "type"],

    // additional
    "@typescript-eslint/explicit-function-return-type": [
      "error",
      {
        allowDirectConstAssertionInArrowFunctions: false,
        allowExpressions: true,
        allowHigherOrderFunctions: false,
      },
    ],
    "@typescript-eslint/strict-boolean-expressions": ["error"],
  },
});
