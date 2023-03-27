module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    'linebreak-style': ['error', 'windows'],
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/prop-types': 0,
    'no-use-before-define': ['error', { variables: false }],
    'no-throw-literal': 0,
    'react/prefer-stateless-function': 0,
    'consistent-return': 0,
    'react/jsx-no-useless-fragment': 0,
    'react/no-unstable-nested-components': [
      'off',
      {
        allowAsProps: true,
      },
    ],
  },
};
