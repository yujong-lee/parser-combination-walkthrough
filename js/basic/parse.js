export const parse = (parser, input) => {
  const result = parser(input);

  if (result.isFailure) {
    throw new Error(`Parse error. expect '${result.expected}'. Found '${result.actual} instead.'`);
  }

  return result;
};

export default {};
