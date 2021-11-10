export const mergeMorning = <M extends any[], D extends any[]>(
  markers: M,
  data: D
) => {
  const morningData = data.find(({ time }) => time === "09:00");

  morningData &&
    markers.push({
      position: [morningData.time, morningData.price],
      text: {
        content: `早盘开始：${morningData.price}`,
        style: {
          textAlign: "end",
          fill: "red",
        },
      },
    });
};
