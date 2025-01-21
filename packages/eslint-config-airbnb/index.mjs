import airbnbBase from '@pasteltech/eslint-config-airbnb-base';
import hooks from './hooks.mjs';
import recommended from './recommended.mjs';
import reactA11y from './rules/react-a11y.mjs';
import reactHooks from './rules/react-hooks.mjs';
import react from './rules/react.mjs';
import whitespace from './whitespace.mjs';

import pkg from './package.json' with { type: 'json' };

export default {
  meta: {
    name: 'eslint-airbnb',
    version: pkg.version,
  },
  configs: {
    base: airbnbBase.configs.base,
    legacy: airbnbBase.configs.legacy,
    recommended,
    hooks,
    whitespace,

    react,
    reactA11y,
    reactHooks,
  },
};
