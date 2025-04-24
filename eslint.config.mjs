import globals from "globals";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettierPlugin from "eslint-plugin-prettier";
import jsoncPlugin from "eslint-plugin-jsonc";
import jsoncParser from "jsonc-eslint-parser";
import markdownPlugin from "eslint-plugin-markdown";
import graphqlPlugin from "eslint-plugin-graphql";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // JavaScript / TypeScript
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: {
      parser: tsParser,
      globals: globals.browser,
    },
    plugins: {
      prettier: prettierPlugin,
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...prettierPlugin.configs.recommended.rules,
      "prettier/prettier": "error",
    },
    ignores: [
      "dist/**",
      "build/**",
      "out/**",
      "coverage/**",
      "node_modules/**",
      "public/**",
    ],
  },

  // JSON
  {
    files: ["**/*.json"],
    languageOptions: {
      parser: jsoncParser,
    },
    plugins: {
      jsonc: jsoncPlugin,
    },
    rules: {
      ...jsoncPlugin.configs["recommended-with-json"].rules,
    },
  },

  // Markdown
  {
    files: ["**/*.md"],
    plugins: {
      markdown: markdownPlugin,
    },
    processor: markdownPlugin.processors.markdown,
  },

  // GraphQL
  {
    files: ["**/*.graphql"],
    plugins: {
      graphql: graphqlPlugin,
    },
    rules: {
      "graphql/template-strings": [
        "error",
        {
          env: "literal",
        },
      ],
    },
  },
]);
