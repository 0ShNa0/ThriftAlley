// https://docs.expo.dev/guides/using-eslint/

module.exports = {
  root: true,
  extends: ["expo", "eslint:recommended"],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
  },
  rules: {
    semi: ["error", "always"], // Enforces semicolons
    // Enforces single quotes
    quotes: ["off", "single", { avoidEscape: true, allowTemplateLiterals: true }]
   
  },
  ignorePatterns: [
    "**/*.test.js",
    "**/*.test.ts",
    "**/*.spec.js",
    "**/*.spec.ts",
    "__tests__/",
    "tests/",
    "test/",
  ],
};
