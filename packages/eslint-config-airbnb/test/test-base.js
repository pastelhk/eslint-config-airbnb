import test from 'tape';
import airbnb from '../index.mjs';

test('base: does not reference react', async (t) => {
  t.plan(2);
  const configs = airbnb.configs.base;

  // scan plugins for react and fail if it is found
  const hasReactPlugin = configs.some(
    (config) => Object.prototype.hasOwnProperty.call(config, 'plugins')
      && Object.keys(config.plugins).indexOf('react') !== -1,
  );
  t.notOk(hasReactPlugin, 'there is no react plugin');

  // scan rules for react/ and fail if any exist
  const reactRuleIds = configs
    .map((config) => Object.keys(config))
    .reduce((acc, rules) => [...acc, ...rules], [])
    .filter((ruleId) => ruleId.indexOf('react/') === 0);
  t.deepEquals(reactRuleIds, [], 'there are no react/ rules');
});
