module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ["airbnb"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["react"],
  rules: {
    quotes: 0,
    "react/prop-types": 0,
    "react/react-in-jsx-scope": 0,
    "arrow-body-style": 0,
    "comma-dangle": 0,
    "no-console": 0,
    "operator-linebreak": 0,
    "consistent-return": 0,
    "no-else-return": 0,
    "import/prefer-default-export": 0,
    "object-curly-newline": 0,
  },
};
