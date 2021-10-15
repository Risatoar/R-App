/* eslint-disable jsx-a11y/alt-text */
import {
  analysisState,
  analysisStatusState,
} from "@/models/game/menghuan/analysis";
import { productState } from "@/models/game/menghuan/product";
import { dbState } from "@/models/game/menghuan/speak";
import {
  List,
  Space,
  InputNumber,
  Switch,
  Modal,
  Form,
  TreeSelect,
  Row,
  Button,
} from "antd";
import { cloneDeep } from "lodash";
import { useRecoilState } from "recoil";
import styles from "./index.module.scss";

const parseTreeData = (data: any[] | any, parentKey = "") => {
  if (!data) {
    return null;
  }
  if (!data.data) {
    return (
      <TreeSelect.TreeNode
        selectable={true}
        value={parentKey ? `${parentKey}.${data.id}` : data.id}
        title={data.name}
      />
    );
  }
  const children = data.data.map((child: any) =>
    parseTreeData(child, parentKey ? `${parentKey}.${data.id}` : data.id)
  );
  return (
    <TreeSelect.TreeNode selectable={false} value={data.id} title={data.name}>
      {children}
    </TreeSelect.TreeNode>
  );
};

const AnalysisResult = () => {
  const [product] = useRecoilState(productState);
  const [db] = useRecoilState(dbState);
  const [dataSource, setDataSource] = useRecoilState(analysisState);
  const [form] = Form.useForm();
  const [status] = useRecoilState(analysisStatusState);

  if (status !== "success") {
    return null;
  }

  const handleResultPriceChange = (price: number, index: number) => {
    const cloneArr = cloneDeep(dataSource);

    cloneArr[index].price = price;

    setDataSource(cloneArr);
  };

  const handleResultDisabledChange = (disabled: boolean, index: number) => {
    const cloneArr = cloneDeep(dataSource);

    cloneArr[index].disabled = disabled;

    setDataSource(cloneArr);
  };

  const handleAddSimilarImages = (url: string) => {
    Modal.confirm({
      content: (
        <Form form={form}>
          <Form.Item name="dependency" label="依赖">
            <TreeSelect allowClear showSearch>
              {product.map((it) => parseTreeData(it))}
            </TreeSelect>
          </Form.Item>
        </Form>
      ),
      onOk: async () => {
        const data = await form.validateFields();

        const target = db?.query({
          where: data.dependency,
        }) as unknown as game_mh_product.Product;

        db?.update(
          { where: data.dependency },
          {
            ...target,
            similarCoverImages: [...target.similarCoverImages!, url],
          }
        );
      },
    });
  };

  const handleAllDataSourceStatusChange = (disabled = false) => {
    const cloneArr = dataSource.map((it) => ({ ...it, disabled }));

    setDataSource(cloneArr);
  };

	console.log(dataSource, 'dataso')

  return (
    <div className={styles.result}>
      <Row>
        <Space>
          <Button
            type="primary"
            onClick={() => handleAllDataSourceStatusChange(true)}
          >
            全部禁用
          </Button>
          <Button
            type="primary"
            onClick={() => handleAllDataSourceStatusChange(false)}
          >
            全部可用
          </Button>
        </Space>
      </Row>
      <div className={styles.priceContainer}>
        <List
          grid={{ column: 5 }}
          dataSource={dataSource}
          renderItem={(item, index) => (
            <List.Item>
              <Space>
                <div className={styles.priceCard}>
                  <img
                    key={index}
                    src={item.url}
                    className={styles.img}
                    onClick={() => handleAddSimilarImages?.(item.url)}
                  />
                  <span>{item.name}</span>
                  <InputNumber
                    value={item.price}
                    onChange={(val) => handleResultPriceChange?.(val, index)}
                    style={{ marginTop: 8, marginBottom: 8 }}
                  />
                  <Switch
                    style={{ width: 64 }}
                    checkedChildren="禁用"
                    unCheckedChildren="可用"
                    checked={item.disabled}
                    onChange={(val) => handleResultDisabledChange?.(val, index)}
                  />
                </div>
              </Space>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default AnalysisResult;
