module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'warn',
    "@typescript-eslint/no-unnecessary-condition": "warn",
    "@typescript-eslint/no-unsafe-return": "error",
    "@typescript-eslint/no-unsafe-call": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/prefer-readonly": "warn",
    "@typescript-eslint/promise-function-async": "warn",
    "@typescript-eslint/await-thenable": "warn",
    "@typescript-eslint/ban-ts-comment": "error",
    "@typescript-eslint/consistent-generic-constructors": "warn",
    "@typescript-eslint/ban-types": [
      "error",
      {
        "types": {
          "Function": false,
          "Object": false,
        },
        "extendDefaults": true
      }
    ]
  },
};
