import {
  silverChartDataByTodayState,
  useSilverModel,
} from "@/models/finance/fg/silver";
import { Chart } from "@antv/g2";
import { memo, useEffect } from "react";
import { useRecoilState } from "recoil";
import * as echarts from "echarts";

export default memo(() => {
  const { fetchTodaysData } = useSilverModel();
  const [{ xAxis, data }] = useRecoilState(silverChartDataByTodayState);

  useEffect(() => {
    fetchTodaysData?.();
  }, [fetchTodaysData]);

  useEffect(() => {
    if (xAxis.length > 0 && data.length > 0) {
      //   const chart = new Chart({
      //     container: document.getElementById("silver-chart-today")!,
      //     width: 500,
      //     height: 400,
      //   });

      //   chart.data(data);

      //   chart.tooltip({
      //     title: "date,time,avg_price,price,volume",
      //   });

      //   chart.line().position("time*price");

      //   chart.render();

      const chart = echarts.init(
        document.getElementById("silver-chart-today")!
      );

      chart.setOption({
        title: "test",
        xAxis: {
          type: "time",
        },
        yAxis: {
            type: 'value',
        },
        series: [
          {
            name: "Fake Data",
            type: "line",
            smooth: true,
            symbol: "none",
            areaStyle: {},
            data: data,
          },
        ],
      });
    }
  }, [xAxis, data]);

  return <div id="silver-chart-today" />;
});
