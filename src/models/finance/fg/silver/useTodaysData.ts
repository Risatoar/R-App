import usePersistCallback from "@/hooks/usePersistCallback";
import { getDataByToday } from "@/services/finance/silver";
import { isEqual } from "lodash";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { interval, Subscription } from "rxjs";
import { silverChartDataByTodayState, silverQueryEnableConfig } from ".";

export const useTodaysData = ({
  useInterval,
}: { useInterval?: boolean } = {}) => {
  const [todayData, setChartDataByToday] = useRecoilState(
    silverChartDataByTodayState
  );
  const [queryEnable] = useRecoilState(silverQueryEnableConfig);

  const fetchTodaysData = usePersistCallback(async () => {
    try {
      let res = await getDataByToday();

      res = (res as string).replace("var hq_str_ml = ", "");

      const { data, xAxis } = JSON.parse(res);

      const chartData = (data as any[]).filter(({ price }) => price !== -1);

      if (
        !isEqual(
          chartData[chartData.length - 1],
          todayData.data[todayData.data.length - 1]
        )
      ) {
        setChartDataByToday({
          xAxis,
          data: (data as any[]).filter(({ price }) => price !== -1),
        });
      }
    } catch (error) {}
  });

  useEffect(() => {
    let sub: Subscription;

    if (useInterval && queryEnable.today) {
      fetchTodaysData?.();

      sub = interval(5000).subscribe(() => fetchTodaysData?.());
    }

    return () => {
      sub?.unsubscribe?.();
    };
  }, [fetchTodaysData, useInterval, queryEnable.today]);

  return {
    data: todayData.data,
    axis: todayData.xAxis,
    fetchTodaysData,
  };
};
