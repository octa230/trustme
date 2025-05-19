import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  {
    parser: "espree",
     parserOptions: {
      ecmaVersion: 2020, // Supports modern JS features
      sourceType: "module", // Support for ES modules
    },
  }
];

export default eslintConfig;
