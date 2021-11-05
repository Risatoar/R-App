import { FG_TYPE_ENUM } from "@/constants/feature-goods";
import { tabState } from "@/models/finance/feature-goods";
import { memo } from "react";
import { useRecoilState } from "recoil";
import styles from "./index.module.scss";
import TodayStatistic from "./TodayStatistic";
import TodayChart from './Chart/Today';

export default memo(() => {
  const [tab] = useRecoilState(tabState);

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
