import { maxBy, minBy } from "lodash";

export const mergeMaxMin = <M extends any[], D extends any[]>(
  markers: M,
  data: D
) => {
  const maxItem = maxBy(data, ({ price }) => price);
  const minItem = minBy(data, ({ price }) => price);

  maxItem &&
    markers.push({
      position: [maxItem.time, maxItem.price],
      text: {
        content: `最高点：${maxItem.price}`,
        style: {
          textAlign: "end",
          fill: "red",
        },
      },
    });

  minItem &&
    markers.push({
      position: [minItem.time, minItem.price],
      text: {
        content: `最低点：${minItem.price}`,
        style: {
          textAlign: "end",
          fill: "red",
          position: "end",
        },
      },
    });
};
