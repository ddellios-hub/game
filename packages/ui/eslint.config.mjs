import baseConfig from "@sandbox/config/eslint";

export default [
  ...baseConfig,
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      globals: {
        React: true
      }
    }
  }
];
