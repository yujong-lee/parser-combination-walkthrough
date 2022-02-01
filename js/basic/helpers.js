export const success = (data, rest) => ({ data, rest });
export const failure = (expected, actual) => ({ isFailure: true, expected, actual });

export const operatorMap = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '*': (a, b) => a * b,
  '/': (a, b) => a / b,
};
