import usePersistCallback from "@/hooks/usePersistCallback";
import { getTodayStatistic } from "@/services/finance/silver";
import { isEqual } from "lodash";
import { useRef, useEffect } from "react";
import { useRecoilState } from "recoil";
import { Subscription, interval } from "rxjs";
import {
  silverTodayStatisticState,
  silverQueryEnableConfig,
  silverConfig,
} from ".";

export const useTodayStatistic = ({
  useInterval,
}: { useInterval?: boolean } = {}) => {
  const [statistic, setStatistic] = useRecoilState(silverTodayStatisticState);
  const [queryEnable] = useRecoilState(silverQueryEnableConfig);
  const currentRef = useRef<Subscription>();

  const fetchTodayStatistic = usePersistCallback(async () => {
    try {
      let res = await getTodayStatistic({
        codes: silverConfig?.code!,
        _: Date.now(),
      });

      res = (res as string).replace("var quote_json = ", "");

      const data = JSON.parse(res)[silverConfig?.code!];

      const parsedData = {
        lastDayValue: data["q2"],
        todayStart: data["q1"],
        max: data["q3"],
        min: data["q4"],
        risePercent: Math.round(data["q80"] * 100) / 100,
        riseValue: data["q70"],
        updateAt: data["time"],
        value: data["q6"],
      };

      if (!isEqual(parsedData, statistic)) {
        setStatistic(parsedData)
      }
    } catch (error) {}
  });

  useEffect(() => {
    if (useInterval && queryEnable.today) {
      if (currentRef.current) {
        currentRef.current.unsubscribe();
      }

      fetchTodayStatistic?.();

      const $interval = interval(3000);

      fetchTodayStatistic?.();

      currentRef.current = $interval.subscribe(() => {
        if (queryEnable.today) {
          fetchTodayStatistic?.();
        }
      });
    }

    return () => {
      currentRef.current?.unsubscribe?.();
    };
  }, [useInterval, currentRef, fetchTodayStatistic, queryEnable.today]);

  return {
    statistic,
    fetchTodayStatistic,
  };
};
