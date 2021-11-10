import { isInSilverQueryRange } from "@/utils/silver/index";
import { useEffect } from "react";
import { atom, useRecoilState } from "recoil";
import { FG_TYPE_DATA_SOURCE, FG_TYPE_ENUM } from "@/constants/feature-goods";
import { interval, Subscription } from "rxjs";

export const silverConfig = FG_TYPE_DATA_SOURCE.find(
  ({ key }) => key === FG_TYPE_ENUM.silver
);

export interface SilverTodayDataItem {
  date: number;
  time: string;
  avg_price: number;
  price: number;
  volume: number;
}

// 日内走势
export const silverTodayChartState = atom({
  key: "silver_today_chart",
  default: [],
});

// 今日概览
export const silverTodayStatisticState = atom({
  key: "silver_today_statistic",
  default: {
    lastDayValue: 0,
    todayStart: 0,
    max: 0,
    min: 0,
    value: 0,
    risePercent: 0,
    riseValue: 0,
    updateAt: 0,
  },
});

export const silverChartDataByTodayState = atom<{
  xAxis: Array<string[]>;
  data: SilverTodayDataItem[];
}>({
  key: "silver_chart_data_today",
  default: {
    xAxis: [],
    data: [],
  },
});

export const silverQueryEnableConfig = atom<{
  today: boolean;
}>({
  key: "silver_query_enable_config",
  default: {
    today: false,
  },
});

export const useSilverModel = ({
  useInterval,
}: { useInterval?: boolean } = {}) => {
  const [queryEnable, setQueryEnable] = useRecoilState(silverQueryEnableConfig);

  useEffect(() => {
    let subscription: Subscription;

    if (useInterval) {
      let $interval = interval(500);

      subscription = $interval.subscribe(() => {
        const isTodayEnable = isInSilverQueryRange();

        const diffs = {
          today: isTodayEnable,
        };

        Object.keys(queryEnable).forEach((key: string) => {
          // @ts-ignore
          if (diffs[key] === queryEnable[key]) {
            // @ts-ignore
            delete diffs[key];
          }
        });

        if (Object.keys(diffs).length > 0) {
          setQueryEnable((prev) => ({
            ...prev,
            ...diffs,
          }));
        }
      });
    }

    return () => {
      subscription?.unsubscribe?.();
    };
  }, [setQueryEnable, queryEnable, useInterval]);
};
