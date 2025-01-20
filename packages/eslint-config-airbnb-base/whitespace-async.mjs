#!/usr/bin/env node

import eslint from 'eslint';
import { fileURLToPath } from 'node:url';
import path from 'path';
import base from './base.mjs';
import whitespaceRules from './whitespace-rules.mjs';

const { isArray } = Array;
const { entries } = Object;

const { ESLint } = eslint;

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

async function onlyErrorOnRules(rulesToError, config) {
  const filename = fileURLToPath(import.meta.url);
  const dirname = path.dirname(filename);

  const cli = new ESLint({
    baseConfig: config,
    overrideConfigFile: true,
    cwd: dirname,
  });

  const calculatedConfig = await cli.calculateConfigForFile(path.join(dirname, './index.mjs'));
  const errorsOnly = { rules: {} };

  entries(calculatedConfig.rules).forEach((rule) => {
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

// eslint-disable-next-line no-console
onlyErrorOnRules(whitespaceRules, base).then((config) => console.log(JSON.stringify(config)));
