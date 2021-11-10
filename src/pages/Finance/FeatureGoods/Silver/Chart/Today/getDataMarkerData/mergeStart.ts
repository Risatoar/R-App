export const mergeStart = <M extends any[], D extends any[]>(
  markers: M,
  data: D
) => {
  markers.push({
    position: [data[0].time, data[0].price],
    autoAdjust: true,
    text: {
      content: `开盘价：${data[0].price}`,
      style: {
        textAlign: "end",
        fill: "red",
      },
    },
  });
};
