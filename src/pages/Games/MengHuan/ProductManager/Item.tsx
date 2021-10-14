import classNames from 'classnames';
import styles from './index.module.scss';
import {
  Space,
  Form,
  Modal,
  Input,
  InputNumber,
  Popconfirm,
  Image,
} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import Select from 'rc-select';
import { useState } from 'react';
import { formatPrice } from '@/utils/game/menghuan';

interface ProductItemProps {
  data?: game_mh_product.Product;
  isCreate?: boolean;
  onCreate?: (data: any) => void;
  onDelete?: (id?: string) => void;
}

const ProductItem = ({
  isCreate = false,
  onCreate,
  onDelete,
  data,
}: ProductItemProps) => {
  const [form] = Form.useForm();
  const [hover, setHover] = useState(false);

  const handleCreate = () => {
    form.resetFields();

    Modal.confirm({
      content: (
        <Form form={form}>
          <Space align="start" direction="vertical">
            <Form.Item label="名称" name="name" required>
              <Input />
            </Form.Item>
            <Form.Item label="封面" name="coverImage">
              <Input />
            </Form.Item>
            <Form.Item label="价格" name="price" required>
              <InputNumber />
            </Form.Item>
            <Form.Item label="标签" name="tags">
              <Select mode="multiple" />
            </Form.Item>
          </Space>
        </Form>
      ),
      onOk: async () => {
        onCreate?.(await form.validateFields());
      },
    });
  };

  return (
    <div className={styles.itemContainer}>
      {isCreate ? (
        <div
          onClick={handleCreate}
          className={classNames(styles.item, styles.create)}
        >
          <PlusOutlined />
        </div>
      ) : (
        <>
          <div
            className={styles.item}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <Image src={data?.coverImage || ''} width={80} height={80} />
            <Popconfirm
              title="确认要删除？"
              onConfirm={() => {
                onDelete?.(data?.id);
              }}
            >
              <div className={styles.delete}>
                <DeleteOutlined />
              </div>
            </Popconfirm>
          </div>
          <div className={styles.statistic}>
            <span className={styles.name}>{data?.name}</span>
            <span className={styles.price}>{formatPrice(data?.price!)}</span>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductItem;
