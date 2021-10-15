import styles from "./index.module.scss";
import { PageHeader, Tabs, Collapse, message, Form, Modal, Button } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useRecoilState } from "recoil";
import { productState, dbState } from "@/models/game/menghuan/product";
import ProductPanel from "./Panel";
import TabForm from "./ModalFrom/Tab";
import { uuid } from "@/utils";
import useMounted from "@/hooks/useMounted";
import usePersistCallback from "@/hooks/usePersistCallback";

const { Panel } = Collapse;
const { TabPane } = Tabs;

const ProductManager = () => {
  const [data, setData] = useRecoilState(productState);
  const [db] = useRecoilState(dbState);
  const [tabForm] = Form.useForm();

  useMounted(() => {
    db?.onDataChange(setData);

    db?.query({ where: "*" });
  });

  const onTabAdd = () => {
    tabForm.resetFields();
    Modal.confirm({
      content: <TabForm form={tabForm} />,
      onOk: async () => {
        const formData = await tabForm.validateFields();

        const newTab = {
          id: uuid(),
          name: formData.name,
          data: (formData.panels as any[])?.map((panel) => ({
            id: uuid(),
            name: panel,
            data: [],
          })),
        };

        db?.add({ where: "*" }, newTab);
      },
    });
  };

  const onTabDelete = (targetKey: string) => {
    if (data.length <= 1) {
      message.error("已经是最后一个 tab 了");
      return;
    }

    db?.remove({ where: targetKey });
  };

  const onEdit = usePersistCallback((targetKey: any, action: any) => {
    if (action === "add") {
      onTabAdd();
      return;
    }
    onTabDelete(targetKey);
  });

  return (
    <>
      <PageHeader title="商品管理" />
      <div className={styles.container}>
        <Tabs type="editable-card" onEdit={onEdit}>
          {data.map(({ id, name, data, activeTab }) => (
            <TabPane tab={name} key={id}>
              <Button title="修改 tab" type="primary">
                <EditOutlined />
                修改 tab
              </Button>
              <Collapse defaultActiveKey={activeTab || []}>
                {data?.map(
                  ({ id: childKey, name: childName, data: childData }) => (
                    <Panel key={childKey!} header={childName}>
                      <ProductPanel
                        tabKey={id}
                        panelKey={childKey}
                        data={childData}
                      />
                    </Panel>
                  )
                )}
              </Collapse>
            </TabPane>
          ))}
        </Tabs>
      </div>
    </>
  );
};

export default ProductManager;
