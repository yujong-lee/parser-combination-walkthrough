import { failure, success } from './helpers';

export const text = (match) => {
  const newParser = (input) => {
    if (!input.startsWith(match)) {
      return failure(match, input);
    }

    return success(match, input.slice(match.length));
  };

  return newParser;
};

export const regex = ({ source }) => {
  const newParser = (input) => {
    const anchoredRegex = new RegExp(`^${source}`);

    const match = anchoredRegex.exec(input);

    if (match == null) {
      return failure(regex, input);
    }

    const matchedText = match[0];

    return success(matchedText, input.slice(matchedText.length));
  };

  return newParser;
};

export const combine = (parsers) => {
  const newParser = (input) => {
    const accData = [];
    let currentInput = input;

    for (let i = 0; i < parsers.length; i += 1) {
      const parser = parsers[i];

      const result = parser(currentInput);

      if (result.isFailure) {
        return result;
      }

      const { data, rest } = result;

      accData.push(data);
      currentInput = rest;
    }

    return success(accData, currentInput);
  };

  return newParser;
};

export const map = (mapper, parser) => {
  const newParser = (input) => {
    const result = parser(input);

    if (result.isFailure) {
      return result;
    }

    const { data, rest } = result;

    return success(mapper(data), rest);
  };

  return newParser;
};

export const apply = (func, parsers) => {
  const newParser = (input) => {
    const accData = [];
    let currentInput = input;

    for (let i = 0; i < parsers.length; i += 1) {
      const parser = parsers[i];

      const result = parser(currentInput);

      if (result.isFailure) {
        return result;
      }

      accData.push(result.data);
      currentInput = result.rest;
    }

    return success(func(...accData), currentInput);
  };

  return newParser;
};

// Non-mutating version

// export const apply = (func, parsers) => {
//   const newParser = (input) => {
//     const initialValue = success([], input);

//     const totalResult = parsers.reduce((acc, parser) => {
//       if (acc.isFailure) {
//         return acc;
//       }

//       const { data, rest } = acc;

//       const result = parser(rest);

//       if (result.isFailure) {
//         return result;
//       }

//       return success([...data, result.data], result.rest);
//     }, initialValue);

//     if (totalResult.isFailure) {
//       return totalResult;
//     }

//     return success(func(...totalResult.data), totalResult.rest);
//   };

//   return newParser;
// };

export const oneOf = (parsers) => {
  const newParser = (input) => {
    for (let i = 0; i < parsers.length; i += 1) {
      const parser = parsers[i];

      const result = parser(input);

      if (!result.isFailure) {
        return result;
      }
    }

    return failure('one of parsers succeed', `every parsers failed at ${input}`);
  };

  return newParser;
};

export const go = (generatorFunction) => {
  const newParser = (input) => {
    const generator = generatorFunction();

    let currentInput = input;
    let generatorResult = generator.next();

    while (!generatorResult.done) {
      const parser = generatorResult.value;

      const result = parser(currentInput);

      if (result.isFailure) {
        return result;
      }

      const { data, rest } = result;

      currentInput = rest;
      generatorResult = generator.next(data);
    }

    return success(generatorResult.value, currentInput);
  };

  return newParser;
};

const pure = (value) => (input) => success(value, input);

export const many = (parser) => {
  const newParser = oneOf([
    go(function* generator() {
      const head = yield parser;
      const tail = yield newParser;

      return [head, ...tail];
    }),
    pure([]),
  ]);

  return newParser;
};
