/* eslint-disable jsx-a11y/alt-text */
import {
  analysisState,
  analysisStatusState,
} from "@/models/game/menghuan/analysis";
import { ipcObserver, ipcRenderer } from "@/utils";
import { Form, Button, Tag, Row, Steps, Col, message as Message } from "antd";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import styles from "./index.module.scss";

const ConfigEditor = () => {
  const [form] = Form.useForm();
  const [status] = useRecoilState(analysisStatusState);
  const [dataSource] = useRecoilState(analysisState);
  const [startPutAway, setStartPutAway] = useState(false);
  const [progress, setProgress] = useState<{
    progress: number;
    step: number;
    stepProgress: number;
    target: any;
    message: string;
    total: number;
  }>({
    progress: 0,
    step: 0,
    stepProgress: 0,
    target: undefined,
    message: "",
    total: 0,
  });

  useEffect(() => {
    if (status === "success") {
      const localConfig = localStorage.getItem("mh_put_away_axis_config");

      if (localConfig) {
        form.setFieldsValue(JSON.parse(localConfig));
      }
    }
  }, [status]);

  if (status !== "success") {
    return null;
  }

  const handleAutoPutAway = (values: any) => {
    localStorage.setItem("mh_put_away_axis_config", JSON.stringify(values));

    const config = {
      productInitialOffset: [values.package[0].x, values.package[0].y],
      productSize: values.productSize,
      priceInputOffset: [values.priceInput.x, values.priceInput.y],
      confirmBtnOffset: [values.putAwayBtn.x, values.putAwayBtn.y],
    };

    setStartPutAway(true);
    const data = dataSource
      .map((res, idx) => ({
        ...res,
        index: idx,
      }))
      .filter(({ disabled }) => !disabled);

    if (data.length === 0) {
      Message.error("当前没有商品可上架");
      return;
    }

    ipcObserver({
      type: "auto-keyboard",
      extraMap: {
        type: "mh-auto-put-away",
        data: {
          ...config,
          data,
        },
      },
    }).subscribe((res) => {
      if (res.finish) {
        setStartPutAway(true);
        Message.success("上架完成！！");
        return;
      }

      if (res.totalProgress) {
        setProgress((prev) => ({ ...prev, total: res.totalProgress }));
        return;
      }

      const { target, targetIdx, childProgress, totalChildProgress, message } =
        res;

      setProgress((prev) => ({
        ...prev,
        progress: (targetIdx * 6 + childProgress) / prev.total,
        target,
        message,
        step: targetIdx,
        stepProgress: childProgress / totalChildProgress,
      }));
    });
  };

  const handlePackageAreaSelect = (
    filed: "package" | "priceInput" | "putAwayBtn"
  ) => {
    ipcRenderer?.send("window-change-event", {
      event: "hide",
    });

    ipcObserver({
      type: "auto-keyboard",
      extraMap: {
        type: "mh-auto-area-select",
        area: filed,
      },
    }).subscribe((res) => {
      form.setFieldsValue({
        [filed]: res,
      });
      if (filed === "package") {
        const xSize = Math.abs(res[0].x - res[1].x) / 5;
        const ySize = Math.abs(res[0].y - res[1].y) / 4;
        form.setFieldsValue({
          productSize: [xSize, ySize],
        });
      }
      ipcRenderer?.send("window-change-event", {
        event: "show",
      });
    });
  };

  return (
    <div className={classNames(styles.column, styles.configContainer)}>
      <Form form={form} onFinish={handleAutoPutAway}>
        <Form.Item label="物品栏大小" shouldUpdate noStyle>
          {({ getFieldValue }) => {
            const size = getFieldValue("productSize") || [];
            return (
              <div>
                <Form.Item name="productSize">
                  <Tag color="orange">
                    物品大小 - 宽：{size[0]}, 高：{size[1]}
                  </Tag>
                </Form.Item>
              </div>
            );
          }}
        </Form.Item>
        <Form.Item shouldUpdate noStyle>
          {({ getFieldValue }) => {
            const axis = getFieldValue("package") || [];
            return (
              <div>
                <Button onClick={() => handlePackageAreaSelect("package")}>
                  设置背包坐标
                </Button>
                <p>选择背包区域的左上角和右下角，两次点击后结束</p>
                <Form.Item name="package">
                  <Row>
                    <Tag color="orange">
                      左上角坐标 x: {axis[0]?.x || 0}, y: {axis[0]?.y || 0}
                    </Tag>
                    <Tag color="orange">
                      右下角坐标 x: {axis[1]?.x || 0}, y: {axis[1]?.y || 0}
                    </Tag>
                  </Row>
                </Form.Item>
              </div>
            );
          }}
        </Form.Item>
        <Form.Item shouldUpdate noStyle>
          {({ getFieldValue }) => {
            const axis = getFieldValue("priceInput") || {};
            return (
              <div>
                <Button onClick={() => handlePackageAreaSelect("priceInput")}>
                  选择价格输入框坐标
                </Button>
                <Form.Item name="priceInput">
                  <Tag color="orange">
                    坐标 x: {axis?.x || 0}, y: {axis?.y || 0}
                  </Tag>
                </Form.Item>
              </div>
            );
          }}
        </Form.Item>
        <Form.Item shouldUpdate noStyle>
          {({ getFieldValue }) => {
            const axis = getFieldValue("putAwayBtn") || {};
            return (
              <div>
                <Button onClick={() => handlePackageAreaSelect("putAwayBtn")}>
                  选择上架按钮坐标
                </Button>
                <Form.Item name="putAwayBtn">
                  <Tag color="orange">
                    坐标 x: {axis?.x || 0}, y: {axis?.y || 0}
                  </Tag>
                </Form.Item>
              </div>
            );
          }}
        </Form.Item>
        <Button type="primary" htmlType="submit">
          开始上架
        </Button>
      </Form>
      {startPutAway && (
        <Steps
          direction="vertical"
          current={progress.progress !== 1 ? 0 : 1}
          percent={~~(progress.progress * 100)}
          className={styles.steps}
        >
          <Steps.Step
            title={`上架中, 当前进度：${~~Number(progress.progress * 100)}%`}
            description={
              <Row>
                <Col>
                  <img
                    src={progress?.target?.url}
                    style={{ width: 40, height: 40 }}
                  />
                  <p className={styles.stepMessage}>{progress.message}</p>
                </Col>
              </Row>
            }
          />
          <Steps.Step title="上架成功" />
        </Steps>
      )}
    </div>
  );
};

export default ConfigEditor;
