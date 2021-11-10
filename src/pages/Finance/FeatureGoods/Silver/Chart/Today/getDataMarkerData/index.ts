import { mergeMaxMin } from "./mergeMinMax";
import { mergeMorning } from "./mergeMorning";
import { SilverTodaySettings } from "..";
import { SilverTodayDataItem } from "@/models/finance/fg/silver";
import { IAnnotationBaseProps } from "bizcharts/lib/components/Annotation/base";
import { DataMarkerOption, DataRegionOption } from "bizcharts/lib/interface";
import { getAvgLineProbability } from "@/utils/silver/probability/today/getAvgLineProbability";
import { mergeStart } from "./mergeStart";
import { mergeProbabilities } from "./mergeProbabilities";
import { mergeMutationRange } from "./mergeMutaitionRange";

type DataSource = Array<
  SilverTodayDataItem & { percents: { up: number; down: number } }
>;

export const getProbability = (
  data: DataSource,
  config: SilverTodaySettings
) => {
  let result: {
    percents: { up: number; down: number };
    date: number;
    time: string;
    avg_price: number;
    price: number;
    volume: number;
  }[] = [];

  data.forEach((e, index) => {
    const avgLineRes = getAvgLineProbability(data, index);

    result.push({
      ...e,
      percents: {
        up: index < config.ignoreProbabilityTime ? 0 : 1 * avgLineRes.up,
        down: index < config.ignoreProbabilityTime ? 0 : 1 * avgLineRes.down,
      },
    });
  });

  return result;
};

export const getDataMarkerData = (
  data: DataSource,
  config: SilverTodaySettings
): Array<
  Partial<DataMarkerOption & IAnnotationBaseProps & DataRegionOption>
> => {
  let markers: Array<Partial<DataMarkerOption & IAnnotationBaseProps>> = [];
  if (data.length > 0) {
    // 开盘价标记
    mergeStart<typeof markers, DataSource>(markers, data);
    // 早盘价
    mergeMorning<typeof markers, DataSource>(markers, data);
    // 最高最低点
    mergeMaxMin<typeof markers, DataSource>(markers, data);
    // 上涨下跌概率
    mergeProbabilities<typeof markers, DataSource>(markers, data, config);
    // 突变区间
    mergeMutationRange<typeof markers, DataSource>(markers, data, config);
  }

  return markers;
};
