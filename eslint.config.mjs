import js from "@eslint/js";
import next from "eslint-config-next";

export default [
  js.configs.recommended,
  ...next(),          // flat config do Next 15+
  {
    ignores: ["node_modules/**", ".next/**", "coverage/**", "dist/**"],
  },
];
