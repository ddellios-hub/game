import baseConfig from "@sandbox/config/eslint";
import nextConfig from "eslint-config-next";

export default [
  ...baseConfig,
  ...nextConfig()
];
