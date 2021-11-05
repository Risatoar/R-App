import { tabState } from "@/models/finance/feature-goods";
import { PageHeader } from "antd";
import { memo } from "react";
import { useHistory } from "react-router";
import TypeSelector from "./TypeSelector";
import styles from "./index.module.scss";
import Silver from "./Silver";

export default memo(() => {
  const history = useHistory();

  return (
    <>
      <PageHeader title="期货" onBack={history.goBack} />
      <div className={styles.container}>
        <TypeSelector />
        <Silver />
      </div>
    </>
  );
});
