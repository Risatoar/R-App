import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Row, Statistic, Card } from "antd";
import { memo } from "react";
import dayjs from "dayjs";
import IsBetween from "dayjs/plugin/isBetween";
import { useTodayStatistic } from "@/models/finance/fg/silver/useTodayStatistic";
import { useRecoilState } from "recoil";
import { silverQueryEnableConfig } from "@/models/finance/fg/silver";

dayjs.extend(IsBetween);

export default memo(() => {
  const { statistic } = useTodayStatistic({
    useInterval: true,
  });
  const [queryEnable] = useRecoilState(silverQueryEnableConfig);

  return (
    <Row justify="space-around">
      <Card>
        <Statistic
          title={"当前状态"}
          value={queryEnable.today ? "开盘中" : "已休盘"}
          valueStyle={{
            color: queryEnable.today ? "#cf1322" : "#333",
          }}
        />
      </Card>
      <Card>
        <Statistic
          title={"涨跌幅"}
          value={statistic.risePercent}
          suffix="%"
          valueStyle={{
            color: statistic.risePercent <= 0 ? "#3f8600" : "#cf1322",
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
          title={`${queryEnable?.today ? "当前" : "收盘"}价格 更新时间：${dayjs(
            statistic.updateAt
          ).format("YYYY-MM-DD hh:mm:ss")}`}
          valueStyle={{
            color: statistic.risePercent <= 0 ? "#3f8600" : "#cf1322",
          }}
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
