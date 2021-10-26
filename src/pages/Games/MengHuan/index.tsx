import styles from "./index.module.scss";
import AutoSpeak from "./Speak";
import ProductManager from "./ProductManager";
import ProductAnalysis from "./ProductAnalysis";
import { PageHeader } from "antd";
import { useHistory } from "react-router-dom";

const MengHuanCenter = () => {
  const history = useHistory();

  return (
    <>
      <PageHeader title="梦幻西游" onBack={() => history.goBack()} />
      <div className={styles.container}>
        <AutoSpeak />
        <ProductManager />
        <ProductAnalysis />
      </div>
    </>
  );
};

export default MengHuanCenter;
