import bestPractices from './rules/best-practices.mjs';
import errors from './rules/errors.mjs';
import es6 from './rules/es6.mjs';
import imports from './rules/imports.mjs';
import node from './rules/node.mjs';
import strict from './rules/strict.mjs';
import style from './rules/style.mjs';
import variables from './rules/variables.mjs';

export default [
  ...bestPractices,
  ...errors,
  ...node,
  ...style,
  ...variables,
  ...es6,
  ...imports,
  ...strict,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },

    rules: {},
  },
];
