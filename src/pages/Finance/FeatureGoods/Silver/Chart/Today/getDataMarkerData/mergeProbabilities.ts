import { SilverTodaySettings } from "..";

export const mergeProbabilities = <M extends any[], D extends any[]>(
  markers: M,
  data: D,
  config: SilverTodaySettings
) => {
  const per = 0.97;
  const spiltNum = 10;

  let probabilities: D = [] as unknown as D;

  const originProbabilities = data
    .map((it, index) => ({
      ...it,
      index,
      status: it.percents.up > per ? "up" : "down",
    }))
    .filter(
      ({ percents }, index) =>
        [percents.up, percents.down].some((p) => p > per) &&
        index > config.ignoreProbabilityTime
    );

  for (let i = 0; i < originProbabilities.length; i += spiltNum) {
    const matchedDeal = originProbabilities.slice(i, i + spiltNum);

    if (matchedDeal.length === 1) {
      probabilities.push(matchedDeal[0]);
    } else if (matchedDeal.length > 1) {
      for (let idx = 0; idx < matchedDeal.length; idx++) {
        const item = matchedDeal[idx];
        const indexed = matchedDeal.slice(idx).map(({ index }) => index);
        const hasNextDataInRange = indexed.find(
          (i) => i <= item.index + spiltNum && i !== item.index
        );

        if (indexed.length === 1 || !hasNextDataInRange) {
          probabilities.push(matchedDeal[idx]);
        }
      }
    }
  }

  probabilities.forEach((pro) => {
    markers.push({
      position: [pro.time, pro.price],
      text: {
        content: pro.percents.up > per ? "开多" : "开空",
        style: {
          fill: pro.percents.up > per ? "red" : "green",
        },
      },
    });
  });
};
