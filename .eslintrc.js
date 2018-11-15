module.exports = {
  extends: ['airbnb-base', 'prettier'],
  parser: 'babel-eslint',
  rules: {
    'no-unused-vars': [
      'error',
      { vars: 'all', args: 'none', ignoreRestSiblings: true },
    ],
  },
};
