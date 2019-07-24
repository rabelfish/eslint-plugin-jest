import { RuleTester } from 'eslint';
import rule from '../no-standalone-expect';

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2015,
    sourceType: 'module',
  },
});

ruleTester.run('no-standalone-expect', rule, {
  valid: [
    'describe("a test", () => { it("an it", () => {expect(1).toBe(1); }); });',
    'describe("a test", () => { it("an it", () => { const func = () => { expect(1).toBe(1); }; }); });',
    'describe("a test", () => { const func = () => { expect(1).toBe(1); }; });',
    'describe("a test", () => { function func() { expect(1).toBe(1); }; });',
    'describe("a test", () => { const func = function(){ expect(1).toBe(1); }; });',
    'const func = function(){ expect(1).toBe(1); };',
  ],
  invalid: [
    {
      code: 'describe("a test", () => { expect(1).toBe(1); });',
      parserOptions: { sourceType: 'module' },
      errors: [{ endColumn: 37, column: 28, messageId: 'unexpectedExpect' }],
    },
    {
      code:
        'describe("a test", () => { const func = () => { expect(1).toBe(1); }; expect(1).toBe(1); });',
      parserOptions: { sourceType: 'module' },
      errors: [{ endColumn: 80, column: 71, messageId: 'unexpectedExpect' }],
    },
    {
      code:
        'describe("a test", () => {  it(() => { expect(1).toBe(1); }); expect(1).toBe(1); });',
      parserOptions: { sourceType: 'module' },
      errors: [{ endColumn: 72, column: 63, messageId: 'unexpectedExpect' }],
    },
    {
      code: 'expect(1).toBe(1);',
      parserOptions: { sourceType: 'module' },
      errors: [{ endColumn: 10, column: 1, messageId: 'unexpectedExpect' }],
    },
  ],
});
