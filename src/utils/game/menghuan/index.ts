export const formatPrice = (price: string | number) => {
  return `${Number(price) / 10000}W`;
};
