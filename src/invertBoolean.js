// const coerceToType = {};

export const invertBoolean = (value) => {
  if (typeof value !== 'boolean') {
    throw new Error('Invalid type');
  }
  return !value;
};
