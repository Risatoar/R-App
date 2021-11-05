import { FG_TYPE_ENUM } from "@/constants/feature-goods";
import { tabState } from "@/models/finance/feature-goods";
import {
  useSilverModel,
  silverTodayStatisticState,
} from "@/models/finance/fg/silver";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Row, Statistic, Card } from "antd";
import { memo, useEffect } from "react";
import { useRecoilState } from "recoil";
import dayjs from "dayjs";
import IsBetween from "dayjs/plugin/isBetween";

dayjs.extend(IsBetween);

export default memo(() => {
  const [tab] = useRecoilState(tabState);
  const [statistic] = useRecoilState(silverTodayStatisticState);

  const { fetchTodayStatistic, fetchTodaysData } = useSilverModel();

  useEffect(() => {
    let timerHandler: ReturnType<typeof setTimeout>;

    if (tab === FG_TYPE_ENUM.silver) {
      fetchTodayStatistic?.();

      fetchTodaysData();

      timerHandler = setInterval(() => {
        const disableTimeRange = [
          ["2:30:00", "9:00:00"],
          ["15:30:00", "20:00:00"],
        ];
        let disable = false;

        disableTimeRange.forEach((range) => {
          const dateStr = dayjs().format("YYYY-MM-DD ");
          if (
            dayjs().isBetween(dateStr + range[0], dateStr + range[1])
          ) {
            disable = true;
          }
        });

        if (!disable) {
          fetchTodayStatistic?.();
        }
      }, 3000);
    }

    return () => {
      clearInterval(timerHandler);
    };
  }, [tab, fetchTodayStatistic]);

  return (
    <Row justify="space-around">
      <Card>
        <Statistic
          title={"涨跌幅"}
          value={statistic.risePercent}
          suffix="%"
          valueStyle={{
            color: statistic.risePercent > 0 ? "#3f8600" : "#cf1322",
          }}
          prefix={
            statistic.risePercent > 0 ? (
              <ArrowUpOutlined />
            ) : (
              <ArrowDownOutlined />
            )
          }
        />
      </Card>
      <Card>
        <Statistic
          title={`当前价格 更新时间：${dayjs(statistic.updateAt).format(
            "YYYY-MM-DD hh:mm:ss"
          )}`}
          value={statistic.value}
          suffix="元/千克"
        />
      </Card>
      <Card>
        <Statistic title={"昨结"} value={statistic.lastDayValue} />
      </Card>
      <Card>
        <Statistic title={"最高"} value={statistic.max} />
      </Card>
      <Card>
        <Statistic title={"最低"} value={statistic.min} />
      </Card>
      <Card>
        <Statistic title={"今开"} value={statistic.todayStart} />
      </Card>
    </Row>
  );
});
