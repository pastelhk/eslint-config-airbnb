import { CLIEngine, ESLint } from 'eslint';
import test from 'tape';
import airbnb from '../index.mjs';
import reactA11yRules from '../rules/react-a11y.mjs';
import reactRules from '../rules/react.mjs';

const DUMMY_FILENAME = 'dummy.jsx';

const rules = {
  // It is okay to import devDependencies in tests.
  'import/no-extraneous-dependencies': [2, { devDependencies: true }],
  // this doesn't matter for tests
  'lines-between-class-members': 0,
  // otherwise we need some junk in our fixture code
  'react/no-unused-class-component-methods': 0,
};
const cli = new (CLIEngine || ESLint)({
  overrideConfig: true,
  baseConfig: airbnb.configs.recommended,
  ...(CLIEngine ? { rules } : { overrideConfig: { rules, files: [DUMMY_FILENAME] } }),
});

async function lint(text) {
  // @see https://eslint.org/docs/developer-guide/nodejs-api.html#executeonfiles
  // @see https://eslint.org/docs/developer-guide/nodejs-api.html#executeontext
  const linter = CLIEngine
    ? cli.executeOnText(text)
    : await cli.lintText(text, { filePath: DUMMY_FILENAME });
  return (CLIEngine ? linter.results : linter)[0];
}

function wrapComponent(body) {
  return `\
import React from 'react';

export default class MyComponent extends React.Component {
/* eslint no-empty-function: 0, class-methods-use-this: 0 */
${body}}
`;
}

test('validate react methods order', (testParent) => {
  testParent.test('make sure our eslintrc has React and JSX linting dependencies', (t) => {
    t.plan(3);
    t.equal(
      reactRules.some((config) => config.plugins.react != null),
      true,
    );
    t.equal(
      reactA11yRules.some((config) => config.plugins.react != null),
      true,
    );
    t.equal(
      reactA11yRules.some((config) => config.plugins['jsx-a11y'] != null),
      true,
    );
  });

  testParent.test('passes a good component', async (t) => {
    const result = await lint(
      wrapComponent(`
  componentDidMount() {}
  handleSubmit() {}
  onButtonAClick() {}
  setFoo() {}
  getFoo() {}
  setBar() {}
  someMethod() {}
  renderDogs() {}
  render() { return <div />; }
`),
    );

    t.notOk(result.warningCount, 'no warnings');
    t.deepEquals(result.messages, [], 'no messages in results');
    t.notOk(result.errorCount, 'no errors');
  });

  testParent.test('order: when random method is first', async (t) => {
    const result = await lint(
      wrapComponent(`
  someMethod() {}
  componentDidMount() {}
  setFoo() {}
  getFoo() {}
  setBar() {}
  renderDogs() {}
  render() { return <div />; }
`),
    );

    t.ok(result.errorCount, 'fails');
    t.deepEqual(
      result.messages.map((msg) => msg.ruleId),
      ['react/sort-comp'],
      'fails due to sort',
    );
  });

  testParent.test('order: when random method after lifecycle methods', async (t) => {
    const result = await lint(
      wrapComponent(`
  componentDidMount() {}
  someMethod() {}
  setFoo() {}
  getFoo() {}
  setBar() {}
  renderDogs() {}
  render() { return <div />; }
`),
    );

    t.ok(result.errorCount, 'fails');
    t.deepEqual(
      result.messages.map((msg) => msg.ruleId),
      ['react/sort-comp'],
      'fails due to sort',
    );
  });

  testParent.test(
    'order: when handler method with `handle` prefix after method with `on` prefix',
    async (t) => {
      const result = await lint(
        wrapComponent(`
  componentDidMount() {}
  onButtonAClick() {}
  handleSubmit() {}
  setFoo() {}
  getFoo() {}
  render() { return <div />; }
`),
      );

      t.ok(result.errorCount, 'fails');
      t.deepEqual(
        result.messages.map((msg) => msg.ruleId),
        ['react/sort-comp'],
        'fails due to sort',
      );
    },
  );

  testParent.test('order: when lifecycle methods after event handler methods', async (t) => {
    const result = await lint(
      wrapComponent(`
  handleSubmit() {}
  componentDidMount() {}
  setFoo() {}
  getFoo() {}
  render() { return <div />; }
`),
    );

    t.ok(result.errorCount, 'fails');
    t.deepEqual(
      result.messages.map((msg) => msg.ruleId),
      ['react/sort-comp'],
      'fails due to sort',
    );
  });

  testParent.test('order: when event handler methods after getters and setters', async (t) => {
    const result = await lint(
      wrapComponent(`
  componentDidMount() {}
  setFoo() {}
  getFoo() {}
  handleSubmit() {}
  render() { return <div />; }
`),
    );

    t.ok(result.errorCount, 'fails');
    t.deepEqual(
      result.messages.map((msg) => msg.ruleId),
      ['react/sort-comp'],
      'fails due to sort',
    );
  });
});
