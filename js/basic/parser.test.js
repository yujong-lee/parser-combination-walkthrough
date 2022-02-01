import { integer, eof, operator } from './parser';

import { failure, success } from './helpers';

describe('integer', () => {
  context('when parse succeed', () => {
    it('returns success', () => {
      expect(integer('12ss')).toEqual(
        success(12, 'ss'),
      );
    });
  });

  context('when parse failed', () => {
    it('returns failure', () => {
      expect(integer('not integer')).toEqual(
        failure('a integer', 'not integer'),
      );
    });
  });
});

describe('eof', () => {
  it('checks eof', () => {
    expect(eof('')).toEqual(success(null, ''));

    expect(eof('something')).toEqual(failure('end of input', 'something'));
  });
});

describe('operator', () => {
  context('when parse succeed', () => {
    it.each([
      ['+ss', 1, 2, 3],
      ['-ss', 1, 2, -1],
      ['*ss', 1, 2, 2],
      ['/ss', 1, 2, 0.5],
    ])('returns function for calculation', (input, a, b, c) => {
      const { data, rest } = operator(input);

      expect(rest).toBe('ss');
      expect(data(a, b)).toBe(c);
    });
  });

  context('when parse failed', () => {
    expect(operator('ss/')).toEqual(failure('a operator', 'ss/'));
  });
});
