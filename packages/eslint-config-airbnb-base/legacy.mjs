import globals from 'globals';
import bestPractices from './rules/best-practices.mjs';
import errors from './rules/errors.mjs';
import node from './rules/node.mjs';
import style from './rules/style.mjs';
import variables from './rules/variables.mjs';

export default [
  ...bestPractices,
  ...errors,
  ...node,
  ...style,
  ...variables,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...Object.fromEntries(Object.entries(globals.amd).map(([key]) => [key, 'off'])),
        ...Object.fromEntries(Object.entries(globals.mocha).map(([key]) => [key, 'off'])),
        ...Object.fromEntries(Object.entries(globals.jasmine).map(([key]) => [key, 'off'])),
      },
    },

    rules: {
      'comma-dangle': ['error', 'never'],
      'prefer-numeric-literals': 'off',

      'no-restricted-properties': [
        'error',
        {
          object: 'arguments',
          property: 'callee',
          message: 'arguments.callee is deprecated',
        },
        {
          property: '__defineGetter__',
          message: 'Please use Object.defineProperty instead.',
        },
        {
          property: '__defineSetter__',
          message: 'Please use Object.defineProperty instead.',
        },
      ],

      'no-var': 'off',
      'prefer-object-spread': 'off',
      strict: ['error', 'safe'],
    },
  },
];
