import { memo, useState } from "react";
import { useRecoilState } from "recoil";
import { SettingState } from "..";
import { Form, InputNumber, Modal } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import styles from "./index.module.scss";
import usePersistCallback from "@/hooks/usePersistCallback";

export default memo(() => {
  const [settings, setSettings] = useRecoilState(SettingState);
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);

  const showSettings = usePersistCallback(() => {
    form.setFieldsValue(settings);

    setVisible(true);
  });

  const handleSettingsChange = usePersistCallback(async () => {
    const values = await form.validateFields();

    setSettings(values);

    setVisible(false);

    localStorage.setItem("silver_today_data_settings", JSON.stringify(values));
  });

  return (
    <>
      <SettingOutlined className={styles.settings} onClick={showSettings} />
      <Modal
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={handleSettingsChange}
      >
        <Form form={form}>
          <Form.Item label="图示涨跌范围设置">
            <Form.Item name="mutationPrice" label="判定突变价格差">
              <InputNumber />
            </Form.Item>
            <Form.Item name="nextBuffer" label="突变区间缓冲判断数量">
              <InputNumber />
            </Form.Item>
            <Form.Item name="mutationRangeLimit" label="突变区间最小价格差">
              <InputNumber />
            </Form.Item>
          </Form.Item>

          <Form.Item label="基础设置">
            <Form.Item name="dealFee" label="手续费">
              <InputNumber />
            </Form.Item>
            <Form.Item name="marginRate" label="保证金">
              <InputNumber />
            </Form.Item>
          </Form.Item>

          <Form.Item label="模拟交易设置">
            <Form.Item
              name="ignoreProbabilityTime"
              label="开盘后忽略计算概率的时间"
            >
              <InputNumber />
            </Form.Item>
            <Form.Item name="baseLostEnable" label="基础可接受回撤价格">
              <InputNumber />
            </Form.Item>
            <Form.Item name="maxLostEnable" label="最大可接受回撤价格">
              <InputNumber />
            </Form.Item>
            <Form.Item name="earnEnable" label="止盈价格">
              <InputNumber />
            </Form.Item>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
});
