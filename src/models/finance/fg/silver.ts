import usePersistCallback from "@/hooks/usePersistCallback";
import { getTodayStatistic, getDataByToday } from "@/services/finance/silver";
import { atom, useRecoilState } from "recoil";
import { FG_TYPE_DATA_SOURCE, FG_TYPE_ENUM } from "@/constants/feature-goods";

const silverConfig = FG_TYPE_DATA_SOURCE.find(({ key }) => FG_TYPE_ENUM.silver);

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
  data: Array<{
    date: number;
    time: string;
    avg_price: number;
    price: number;
    volume: number;
  }>;
}>({
  key: "silver_chart_data_today",
  default: {
    xAxis: [],
    data: [],
  },
});

export const useSilverModel = () => {
  const [, setStatistic] = useRecoilState(silverTodayStatisticState);
  const [, setChartDataByToday] = useRecoilState(silverChartDataByTodayState);

  const fetchTodayStatistic = usePersistCallback(async () => {
    try {
      let res = await getTodayStatistic({
        codes: silverConfig?.code!,
        _: Date.now(),
      });

      res = (res as string).replace("var quote_json = ", "");

      const data = JSON.parse(res)[silverConfig?.code!];

      setStatistic({
        lastDayValue: data["q2"],
        todayStart: data["q1"],
        max: data["q3"],
        min: data["q4"],
        risePercent: Math.round(data["q80"] * 100) / 100,
        riseValue: data["q70"],
        updateAt: data["time"],
        value: data["q6"],
      });
    } catch (error) {}
  });

  const fetchTodaysData = usePersistCallback(async () => {
    try {
      let res = await getDataByToday();

      res = (res as string).replace("var hq_str_ml = ", "");

      const { data, xAxis } = JSON.parse(res);

      setChartDataByToday({
        xAxis,
        data,
      });
    } catch (error) {}
  });

  return {
    fetchTodayStatistic,
    fetchTodaysData,
  };
};
