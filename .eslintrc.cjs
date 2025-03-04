module.exports = {
  root: true,
  env: { browser: true, es2021: true, "vitest-globals/env": true, node: true },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "plugin:vitest-globals/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parserOptions: { ecmaVersion: 12, sourceType: "module", parser: '@typescript-eslint/parser' },
  settings: { react: { version: "18.2" } },
  plugins: ["react-refresh", '@typescript-eslint'],
  rules: {
    "react/jsx-no-target-blank": "off",
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "react/prop-types": "off",
  },
};
