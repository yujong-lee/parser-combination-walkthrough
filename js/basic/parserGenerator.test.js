import {
  text, regex, combine, map, apply, oneOf, go, many,
} from './parserGenerator';

import { parse } from './parse';
import { eof, integer, operator } from './parser';
import { success } from './helpers';

describe('text', () => {
  it('returns text parser', () => {
    const parser = text('+');

    expect(parse(parser, '+ss')).toEqual(success('+', 'ss'));

    expect(() => { parse(parser, 'ss+'); }).toThrow();
  });
});

describe('regex', () => {
  it('returns regex parser', () => {
    const decimalParser = regex(/\d+(?:\.\d+)?/);

    expect(parse(decimalParser, '12.34ss')).toEqual(success('12.34', 'ss'));
    expect(() => { parse(decimalParser, 'ss12.34'); }).toThrow();
  });
});

describe('combine', () => {
  it('combine parsers', () => {
    const parser = combine([
      text('<'),
      integer,
      text('>'),
    ]);

    expect(parse(parser, '<3>ss')).toEqual(success(['<', 3, '>'], 'ss'));
  });
});

describe('map', () => {
  it('returns parser which returns mapped result of original', () => {
    const decimalParser = regex(/\d+(?:\.\d+)?/);
    const newParser = map((x) => +x, decimalParser);

    expect(newParser('12.1ss')).toEqual(success(12.1, 'ss'));
  });
});

describe('apply', () => {
  const parser = apply((a, func, b) => func(a, b), [integer, operator, integer]);

  expect(parse(parser, '1-2')).toEqual(success(-1, ''));
});

describe('oneOf', () => {
  context('when at least one of parsers succeed', () => {
    it('succeed', () => {
      const parser = oneOf([
        text('+'),
        text('-'),
      ]);

      expect(parse(parser, '-3')).toEqual(success('-', '3'));
    });
  });

  context('none of parsers succeed', () => {
    it('fails', () => {
      const parser = oneOf([
        text('+'),
        text('-'),
      ]);

      expect(() => { parse(parser, '/3'); }).toThrow();
    });
  });
});

describe('go', () => {
  it('can replace apply', () => {
    const parser = go(function* generator() {
      const a = yield integer;
      const func = yield operator;
      const b = yield integer;

      yield eof;

      return func(a, b);
    });

    expect(parse(parser, '1-2')).toEqual(success(-1, ''));
  });

  it('can parse HTML which can not be done with apply', () => {
    const parser = go(function* generator() {
      yield text('<');
      const tagName = yield regex(/[^>]*/);
      yield text('>');

      const content = yield regex(/[^<]*/);

      yield text(`</${tagName}>`);

      return `${tagName}: ${content}`;
    });

    expect(parse(parser, '<h1>title</h1>')).toEqual(success('h1: title', ''));
  });

  describe('many', () => {
    it('parses unknown length', () => {
      const parser = many(text('x'));

      expect(parse(parser, 'xxxss')).toEqual(success(['x', 'x', 'x'], 'ss'));
    });

    it('parses unknown length 2', () => {
      const parser = go(function* generator() {
        const first = yield integer;
        const rest = yield many(combine([operator, integer]));
        yield eof;

        return rest.reduce((acc, [op, num]) => op(acc, num), first);
      });

      expect(parse(parser, '1-2+3*4')).toEqual(success(8, ''));
    });
  });
});
