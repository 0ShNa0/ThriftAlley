// https://docs.expo.dev/guides/using-eslint/

module.exports = {
  root: true,
  extends: ['expo', 'eslint:recommended'],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  rules: {
    'semi': ['error', 'always'], // Enforces semicolons
    'quotes': ['error', 'single'], // Enforces single quotes
  },
  ignorePatterns: [
      '**/*.test.js',
      '**/*.test.ts',
      '**/*.spec.js',
      '**/*.spec.ts',
      '__tests__/',
      'tests/',
      'test/'
    ]
};