/* eslint strict: 0, global-require: 0 */

'use strict';

import test from 'tape';

test('all entry points parse', (t) => {
  t.doesNotThrow(() => import('../index.mjs'), 'index does not throw');

  t.end();
});
