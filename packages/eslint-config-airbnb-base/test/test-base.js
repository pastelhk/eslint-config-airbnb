import fs from 'fs';
import path from 'path';
import test from 'tape';

const files = {
  ...{
    base: path.join(__dirname, '..', 'base.mjs'),
    legacy: path.join(__dirname, '..', 'legacy.mjs'),
  },
}; // object spread is to test parsing

const rulesDir = path.join(__dirname, '../rules');
fs.readdirSync(rulesDir).forEach((name) => {
  files[name] = path.join(rulesDir, name);
});

Object.keys(files).forEach(
  (
    name, // trailing function comma is to test parsing
  ) => {
    test(`${name}: does not reference react`, async (t) => {
      t.plan(2);
      const { default: configs } = await import(files[name]);

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
  },
);
