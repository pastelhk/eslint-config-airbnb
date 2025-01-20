/* eslint global-require: 0 */

import { execSync } from 'child_process';
import eslint from 'eslint';
import { fileURLToPath } from 'node:url';
import path from 'path';
import base from './base.mjs';
import whitespaceRules from './whitespace-rules.mjs';

const { isArray } = Array;
const { entries } = Object;

const { CLIEngine } = eslint;

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

let overrideConfig;

if (CLIEngine) {
  /* eslint no-inner-declarations: 0 */
  const severities = ['off', 'warn', 'error'];

  function getSeverity(ruleConfig) {
    if (isArray(ruleConfig)) {
      return getSeverity(ruleConfig[0]);
    }
    if (typeof ruleConfig === 'number') {
      return severities[ruleConfig];
    }
    return ruleConfig;
  }

  function onlyErrorOnRules(rulesToError, config) {
    const cli = new CLIEngine({ baseConfig: config, overrideConfig: true, cwd: dirname });

    const baseConfig = cli.getConfigForFile(path.join(dirname, './index.mjs'));
    const errorsOnly = { rules: {} };

    entries(baseConfig.rules).forEach((rule) => {
      const ruleName = rule[0];
      const ruleConfig = rule[1];
      const severity = getSeverity(ruleConfig);

      if (rulesToError.indexOf(ruleName) === -1 && severity === 'error') {
        if (isArray(ruleConfig)) {
          errorsOnly.rules[ruleName] = ['warn'].concat(ruleConfig.slice(1));
        } else if (typeof ruleConfig === 'number') {
          errorsOnly.rules[ruleName] = 1;
        } else {
          errorsOnly.rules[ruleName] = 'warn';
        }
      }
    });

    return errorsOnly;
  }

  overrideConfig = onlyErrorOnRules(whitespaceRules, base);
} else {
  // NOTE: ESLint adds runtime statistics to the output (so it's no longer JSON) if TIMING is set

  overrideConfig = JSON.parse(
    String(
      execSync(path.join(dirname, 'whitespace-async.mjs'), {
        env: {
          ...process.env,
          TIMING: undefined,
        },
      }),
    ),
  );
}

export default [...base, overrideConfig];
