import { getMaxAndMinByData } from "@/utils/silver";
import { SilverTodayDataItem } from "@/models/finance/fg/silver";

const getRateByPriceDiff = (cur: number, max: number) => {
	if (cur === 0) {
		return 0;
	} else if (cur === max) {
		return 1;
	}

  const lev1 = max * 0.2 < 5 ? 5 : max * 0.2;
  const lev2 = max * 0.4 < 10 ? 10 : max * 0.4;
  const lev3 = max * 0.6 < 15 ? 15 : max * 0.6;
  const lev4 = max * 0.8 < 20 ? 20 : max * 0.8;

  switch (true) {
    case cur > 0 && cur <= lev1:
      return 0.2;
    case cur > lev1 && cur <= lev2:
      return 0.4;
    case cur > lev2 && cur <= lev3:
      return 0.6;
    case cur > lev3 && cur <= lev4:
      return 0.75;
    default:
      return cur / max;
  }
};

/**
 * 偏离均线后修复概率计算
 * */
export const getAvgLineProbability = (
  data: SilverTodayDataItem[],
  index: number
) => {
  const target = data[index];
  /** 现价、均价差值 */
  const priceDiff = target.price - target.avg_price;
  /** 现价是否小于均价 */
  const isBelow = target.price - target.avg_price < 0;
  /** 获取当前最高、最低价 */
  const [max, min] = getMaxAndMinByData(data.slice(0, index + 1), { float: [0, 0] });
  /** 获取最高价、最低价偏离均线的差值 */
  const [avgDiffMax, avgDiffMin] = [
    max - target.avg_price,
    min - target.avg_price,
  ];
  /** 获取在档期点位前，以同样趋势偏离点位的数据 */
  const prevAvgDiffData = [];
  const priceRate = getRateByPriceDiff(
    Math.abs(priceDiff),
    Math.abs(isBelow ? avgDiffMin : avgDiffMax)
  );

  const rateByPrice =
    (Math.abs(priceDiff) / Math.abs(isBelow ? avgDiffMin : avgDiffMax)) *
    priceRate;

  if (target.time === "21:32") {
    console.log(target, priceDiff, avgDiffMin, rateByPrice, priceRate, data.slice(0, index));
  }

  return {
    up: isBelow ? rateByPrice : 1 - rateByPrice,
    down: isBelow ? 1 - rateByPrice : rateByPrice,
  };
};
