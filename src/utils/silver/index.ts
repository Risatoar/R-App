import isBetween from "dayjs/plugin/isBetween";
import dayjs from "dayjs";
import { SILVER_QUERY_DISABLE_RANGE } from "@/constants/feature-goods";
import max from "lodash/max";
import min from "lodash/min";

dayjs.extend(isBetween);

export const isInSilverQueryRange = () => {
  let inRange = true;

  SILVER_QUERY_DISABLE_RANGE.today.forEach((range) => {
    const dateStr = dayjs().format("YYYY-MM-DD ");

    if (dayjs().isBetween(dateStr + range[0], dateStr + range[1])) {
      inRange = false;
    }
  });

  return inRange;
};

export const getMaxAndMinByData = (
  data: Array<{ price: number }>,
  config: {
    float: [max: number, min: number];
  } = {
    float: [20, -20],
  }
) => {
  if (data.length === 0) {
    return [-50, 50];
  }

  if (data.length === 1) {
    return [
      (data[0] as unknown as number) - 5,
      (data[0] as unknown as number) + 5,
    ];
  }

  const prices = data.map(({ price }) => price);

  return [max(prices)! + config.float?.[0], min(prices)! + config.float?.[1]];
};
