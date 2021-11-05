import { PageHeader } from "antd";
import { memo } from "react";
import styles from "./index.module.scss";

const AxisManager = memo(() => {
  return (
    <>
      <PageHeader title="坐标管理" />
      <div className={styles.container}></div>
    </>
  );
});

export default AxisManager;
