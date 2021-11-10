import { max, min } from "lodash";
import { SilverTodaySettings } from "..";

const getMutationRange = <D extends any[]>(
  data: D,
  config: SilverTodaySettings
): D[] => {
  const mutationPrice = config.mutationPrice;
  const nextBuffer = config.nextBuffer;
  const arr = [];
  let idx = 0;

  while (idx < data.length - 1) {
    let cache: any[] = [];
    let next = false;
    let status: "up" | "down" = "up";
    let cursor = 1;

    const preDiff = data[idx].price - data[idx + 1]?.price;

    if (Math.abs(preDiff) >= mutationPrice) {
      next = true;
      cache = [data[idx], data[idx + 1]];
      cursor++;
      status = preDiff > 0 ? "down" : "up";
    }

    while (next) {
      const nextIdx = cursor + idx;
      const lastCacheVal = cache[cache.length - 1]?.price;
      const diff = data[nextIdx]?.price - lastCacheVal || 0;

      if (status === "up" ? diff >= mutationPrice : diff < -mutationPrice) {
        cache.push(data[nextIdx]);
        cursor++;
      } else {
        const range = data
          .slice(nextIdx + 1, nextIdx + nextBuffer)
          .map(({ price }) => price);
        const val = status === "up" ? max(range) : min(range);

        if (
          Math.abs(val! - lastCacheVal) > mutationPrice &&
          range.length >= 2
        ) {
          cache = cache.concat(data.slice(nextIdx, nextIdx + 2));
          cursor += range.length;
        } else {
          next = false;
        }
      }
    }

    if (cache.length >= 5) {
      arr.push(cache);
      idx += cursor;
    } else {
      idx++;
    }
  }

  return arr as D[];
};

export const mergeMutationRange = <M extends any[], D extends any[]>(
  markers: M,
  data: D,
  config: SilverTodaySettings
) => {
  if (data.length > 10) {
    const mutation = getMutationRange(data, config).filter(
      (arr) =>
        Math.abs(arr[arr.length - 1].price - arr[0].price) >=
        config.mutationRangeLimit
    );

    if (mutation.length > 0) {
      // @ts-ignore
      markers = [
        ...markers!,
        ...mutation.map((arr) => ({
          start: [arr[0].time, arr[0].price],
          end: [arr[arr.length - 1].time, arr[arr.length - 1].price],
          text: {
            content: `${arr[0].time} - ${arr[arr.length - 1].time} \n${
              arr[arr.length - 1].price > arr[0].price ? "上升通道" : "下降通道"
            }: ${arr[0].price} - ${arr[arr.length - 1].price}`,
          },
          color: arr[arr.length - 1].price > arr[0].price ? "red" : "green",
          apply: ["area"],
          position: "end",
        })),
      ];
    }
  }
};
