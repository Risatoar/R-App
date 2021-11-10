import usePersistCallback from "@/hooks/usePersistCallback";
import { LineChartOutlined } from "@ant-design/icons";
import { Modal, List } from "antd";
import classNames from "classnames";
import dayjs from "dayjs";
import { memo, useMemo, useState } from "react";
import styles from "./index.module.scss";

interface MutationDashboardProps {
  dataSource: Array<{
    start: string[];
    end: string[];
  }>;
}

export default memo(({ dataSource }: MutationDashboardProps) => {
  const [visible, setVisible] = useState(false);

  const data = useMemo(
    () =>
      dataSource
        .filter(({ start }) => Boolean(start))
        .map(({ start, end }) => {
          const isRise = end[1] > start[1];
          const duration = dayjs(dayjs().format("YYYY-MM-DD ") + end[0]).diff(
            dayjs().format("YYYY-MM-DD ") + start[0],
            "m"
          );

          return {
            title: `${start[1]} ---> ${end[1]}，${
              Number(end[1]) - Number(start[1])
            }`,
            description: `${start[0]} ---> ${end[0]}，duration: ${duration}min`,
            isRise,
          };
        }),
    [dataSource]
  );

  const showDashboard = usePersistCallback(() => {
    setVisible(true);
  });

  return (
    <>
      <LineChartOutlined onClick={showDashboard} />
      <Modal visible={visible} onCancel={() => setVisible(false)}>
        <List
          dataSource={data}
          renderItem={({ title, description, isRise }) => (
            <List.Item className={styles.listItem}>
              <List.Item.Meta description={description} title={title} />
              <span
                className={classNames(styles.status, {
                  [styles.statusDown]: !isRise,
                })}
              >
                {isRise ? "上涨" : "下跌"}
              </span>
            </List.Item>
          )}
        />
      </Modal>
    </>
  );
});
