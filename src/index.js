// const coerceToType = {};

export const invertBoolean = (value) => {
  if (typeof value !== 'boolean') {
    throw new Error('Invalid type');
  }
  return !value;
};

// console.log(parseFloat('L'));

// export const strictConvertToNumber = (value) => {
//   const dataType = typeof value;

//   if (dataType === 'string') {
//     const isValidString = value.replaceAll(DIGITS_AND_DOT, '');
//     if (isValidString) {
//       return;
//     } else {
//       v;
//     }
//   }
// };
