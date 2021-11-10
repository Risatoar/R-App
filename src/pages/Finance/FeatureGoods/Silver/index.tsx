import { FG_TYPE_ENUM } from "@/constants/feature-goods";
import { tabState } from "@/models/finance/feature-goods";
import { memo } from "react";
import { useRecoilState } from "recoil";
import styles from "./index.module.scss";
import TodayStatistic from "./TodayStatistic";
import TodayChart from "./Chart/Today";
import { useSilverModel } from "@/models/finance/fg/silver";

export default memo(() => {
  const [tab] = useRecoilState(tabState);

  useSilverModel({
    useInterval: tab === FG_TYPE_ENUM.silver
  })

  if (tab !== FG_TYPE_ENUM.silver) {
    return null;
  }

  return (
    <div className={styles.statistic}>
      <TodayStatistic />
      <TodayChart />
    </div>
  );
});
