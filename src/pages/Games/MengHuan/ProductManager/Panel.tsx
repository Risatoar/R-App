import { dbState } from '@/models/game/menghuan/product';
import { uuid } from '@/utils';
import { Space } from 'antd';
import { useRecoilState } from 'recoil';
import styles from './index.module.scss';
import PanelItem from './Item';

interface ProductPanelProps {
  tabKey?: string;
  panelKey?: string;
  data?: game_mh_product.Product[];
}

const ProductPanel = ({
  tabKey,
  panelKey,
  data = [],
}: ProductPanelProps) => {
  const [db] = useRecoilState(dbState);

  const onCreate = (data: any) => {
    db?.add({ where: `${tabKey}.${panelKey}` }, {
      name: data.name,
      id: uuid(),
      coverImage: data.coverImage || '',
      price: data.price || 0,
      tags: data.tags || [],
      createAt: Date.now(),
      lastSelectedAt: 0,
    })
  };

  const onDelete = (id?: string) => {
    db?.remove({ where: `${tabKey}.${panelKey}.${id}` })
  };

  return (
    <div className={styles.panel}>
      <Space align="start">
        {data.map((data) => (
          <PanelItem data={data} key={data?.id} onDelete={onDelete} />
        ))}
        <PanelItem isCreate={true} onCreate={onCreate} />
      </Space>
    </div>
  );
};

export default ProductPanel;
