import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    name: "sandbox/base",
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        projectService: true
      }
    },
    rules: {
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
      "no-console": ["error", { "allow": ["warn", "error"] }]
    }
  }
);
