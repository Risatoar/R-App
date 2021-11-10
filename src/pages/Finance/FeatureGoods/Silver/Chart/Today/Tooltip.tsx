/* eslint-disable import/no-anonymous-default-export */
import { Tooltip } from "bizcharts";
import styles from "./index.module.scss";

const formatPercent = (percent: number) =>
  Number(percent * 100)
    .toFixed(2)
    .toString() + "%";

export default (props: any) => (
  <Tooltip {...props}>
    {(title, items) => {
      const { price, avg_price, time, percents } = items?.[0]?.data;
      return (
        <div className={styles.tooltip} key={time}>
          <span className={styles.tooltipTitle}>{title}</span>
          <span className={styles.tooltipItem}>
            现价：<span className={styles.tooltipValue}>{price}</span>
          </span>
          <span className={styles.tooltipItem}>
            均价：<span className={styles.tooltipValue}>{~~avg_price}</span>
          </span>
          <span className={styles.tooltipItem}>
            上涨概率：
            <span className={styles.tooltipValue}>
              {formatPercent(percents?.up)}
            </span>
          </span>
          <span className={styles.tooltipItem}>
            下跌概率：
            <span className={styles.tooltipValue}>
              {formatPercent(percents?.down)}
            </span>
          </span>
        </div>
      );
    }}
  </Tooltip>
);
