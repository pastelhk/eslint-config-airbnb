export default [
  {
    rules: {
      // disabled because I find it tedious to write tests while following this rule
      'no-shadow': 0,

      // tests uses `t` for tape
      'id-length': [2, { min: 2, properties: 'never', exceptions: ['t'] }],
    },
  },
];
