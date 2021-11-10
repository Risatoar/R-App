export const parse = (str: string, defaultValue: any) => {
  try {
    return JSON.parse(str) || defaultValue;
  } catch (error) {
    return defaultValue;
  }
};
