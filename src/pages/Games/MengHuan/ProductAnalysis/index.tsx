/* eslint-disable jsx-a11y/alt-text */
import { Col, PageHeader } from "antd";
import styles from "./index.module.scss";
import ConfigEditor from "./config-editor";
import AnalysisResult from "./analysis-result";
import PackageUpload from "./package-upload";

const ProductAnalysis = () => {
  return (
    <>
      <PageHeader title="背包解析/自动上架" />
      <div className={styles.container}>
        <ConfigEditor />
        <Col>
          <PackageUpload />
          <AnalysisResult />
        </Col>
      </div>
    </>
  );
};

export default ProductAnalysis;
