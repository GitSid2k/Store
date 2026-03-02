module.exports = {
  root: false,
  extends: ["next", "next/core-web-vitals"],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
  },
  rules: {
    "@typescript-eslint/no-explicit-any": "error",
    "react/jsx-key": "warn",
  },
};
