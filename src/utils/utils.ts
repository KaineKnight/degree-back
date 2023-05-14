export const emptyStringToNull = (params) => {
  return params.value === '' ? null : params.value;
};
