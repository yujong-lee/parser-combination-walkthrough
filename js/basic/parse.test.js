import { parse } from './parse';

import { failure, success } from './helpers';

describe('parse', () => {
  context('when parse failed', () => {
    it('throws error', () => {
      const parser = () => failure('a', 'b');

      expect(() => { parse(parser, 'input'); }).toThrow();
    });
  });

  context('when parse succeed', () => {
    it('returns result of parser', () => {
      const parser = () => success('data', 'rest');

      expect(parse(parser, 'input')).toEqual(success('data', 'rest'));
    });
  });
});
