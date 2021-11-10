// @ts-nocheck
import { useTodaysData } from "@/models/finance/fg/silver/useTodaysData";
import { getMaxAndMinByData } from "@/utils/silver";
import { Axis, Chart, LineAdvance, Annotation } from "bizcharts";
import { memo, useMemo } from "react";
import { atom, useRecoilState } from "recoil";
import { getDataMarkerData, getProbability } from "./getDataMarkerData";
import Settings from "./Settings";
import Tooltip from "./Tooltip";
import styles from "./index.module.scss";
import MutationDashboard from "./MutationDashboard";
import { Space } from "antd";
import { parse } from "@/utils/json";

export interface SilverTodaySettings {
  /** 下分钟被判定为突变的价格差 */
  mutationPrice: number;
  /** 突变区间缓冲判断数量 */
  nextBuffer: number;
  /** 突变区间最小价格差 */
  mutationRangeLimit: number;
  /** 开盘后忽略计算概率的时间 */
  ignoreProbabilityTime: number;
  /** 手续费率 */
  dealFee: number;
  /** 保证金比例 */
  marginRate: number;
  /** 基础可接受回撤价格 */
  baseLostEnable: number;
  /** 最大可接受回撤价格 */
  maxLostEnable: number;
  /** 止盈价格 */
  earnEnable: number;
}

export const SettingState = atom<SilverTodaySettings>({
  key: "silver_today_data_settings",
  default: parse(localStorage.getItem("silver_today_data_settings"), {
    mutationPrice: 2,
    nextBuffer: 3,
    mutationRangeLimit: 5,
    ignoreProbabilityTime: 30,
    dealFee: 0.00075,
    marginRate: 0.2
  }),
});

export default memo(() => {
  const { data } = useTodaysData({ useInterval: true });
  const [settings] = useRecoilState(SettingState);

  const formatData = useMemo(() => getProbability(data, settings), [data, settings]);

  const markers = useMemo(
    () => getDataMarkerData(formatData, settings),
    [formatData, settings]
  );

  const maxMin = useMemo(() => getMaxAndMinByData(data), [data]);

  return (
    <div className={styles.container}>
      <Chart
        data={formatData}
        autoFit
        height={400}
        scale={{
          price: {
            min: maxMin[1],
            max: maxMin[0],
          },
          avg_price: {
            min: maxMin[1],
            max: maxMin[0],
          },
        }}
        appendPadding={[24, 20, 20, 20]}
      >
        <Tooltip />
        <Axis name="avg_price" visible={false} />
        <Axis name="x" visible={false} />
        {markers.map((marker) =>
          marker?.start ? (
            <>
              <Annotation.RegionFilter {...marker} />
              {/* <Annotation.DataRegion {...marker} /> */}
            </>
          ) : (
            <Annotation.DataMarker {...marker} />
          )
        )}
        <LineAdvance shape="smooth" area position="time*price" />
        <LineAdvance shape="smooth" position="time*avg_price" color="orange" />
      </Chart>
      <div className={styles.icons}>
        <Space>
          <Settings />
          <MutationDashboard dataSource={markers} />
        </Space>
      </div>
    </div>
  );
});
