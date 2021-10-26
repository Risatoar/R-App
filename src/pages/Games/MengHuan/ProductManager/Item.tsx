import classNames from "classnames";
import styles from "./index.module.scss";
import {
  Form,
  Modal,
  Input,
  InputNumber,
  Image,
  Select,
  Card,
} from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { formatPrice } from "@/utils/game/menghuan";
import LocalFileUploader from "@/components/common/LocalFileUploader";

interface ProductItemProps {
  data?: game_mh_product.Product;
  isCreate?: boolean;
  onCreate?: (data: any) => void;
  onDelete?: (id?: string) => void;
  onUpdate?: (data: any, id: string) => void;
}

const ProductItem = ({
  isCreate = false,
  onCreate,
  onDelete,
  onUpdate,
  data,
}: ProductItemProps) => {
  const [form] = Form.useForm();

  const handleCreateOrUpdate = (values?: any) => {
    if (!values) {
      form.resetFields();
    } else {
      form.setFieldsValue(values);
    }

    Modal.confirm({
      title: "修改",
      content: (
        <Form form={form} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
          <Form.Item label="名称" name="name" required>
            <Input />
          </Form.Item>
          <Form.Item label="封面" name="coverImage">
            <LocalFileUploader />
          </Form.Item>
          <Form.Item label="价格" name="price" required>
            <InputNumber />
          </Form.Item>
          <Form.Item label="标签" name="tags">
            <Select mode="tags" size="large" style={{ width: 200 }} />
          </Form.Item>
        </Form>
      ),
      onOk: async () => {
        const data = await form.validateFields();

        if (!values) {
          onCreate?.(data);
        } else {
          onUpdate?.(data, values?.id);
        }
      },
    });
  };

  return (
    <div className={styles.itemContainer}>
      {isCreate ? (
        <div
          onClick={() => handleCreateOrUpdate()}
          className={classNames(styles.item, styles.create)}
        >
          <PlusOutlined />
        </div>
      ) : (
        <Card
          hoverable
          size="small"
          cover={<Image src={data?.coverImage || ""} height={80} />}
          actions={[
            <EditOutlined
              key="edit"
              onClick={() => handleCreateOrUpdate?.(data)}
            />,
            <DeleteOutlined
              key="delete"
              onClick={() => onDelete?.(data?.id)}
            />,
          ]}
        >
          <div className={styles.statistic}>
            <span className={styles.name}>{data?.name}</span>
            <span className={styles.price}>{formatPrice(data?.price!)}</span>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ProductItem;
