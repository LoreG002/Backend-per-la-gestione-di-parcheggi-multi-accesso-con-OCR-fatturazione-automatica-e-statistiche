/* eslint-disable no-undef, @typescript-eslint/no-require-imports */

// eslint.config.cjs
const js = require('@eslint/js');
const tseslint = require('typescript-eslint');

module.exports = [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: [
      'node_modules/',
      'dist/',
      'build/',
      'coverage/',
      '.env',
      'eslint.config.cjs',
      'jest.config.cjs',
      '**/__tests__/**',
      '*.test.ts',
      '*.spec.ts',
      'scripts/',
      'temp/'
    ]
  },
  {
    files: ['**/*.ts'],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      'no-trailing-spaces': 'error',
      'space-before-blocks': ['error', 'always'],
      'keyword-spacing': ['error', { before: true, after: true }],
      'space-in-parens': ['error', 'never'],
      'space-infix-ops': 'error',
      'indent': ['error', 2],
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }]
    }
  }
];
