import airbnbBase from '@pasteltech/eslint-config-airbnb-base';
import reactA11y from './rules/react-a11y.mjs';
import react from './rules/react.mjs';

export default [
  ...airbnbBase.configs.base,
  ...react,
  ...reactA11y,
  {
    rules: {},
  },
];
