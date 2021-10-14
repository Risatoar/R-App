import styles from './index.module.scss';
import AutoSpeak from './Speak';
import ProductManager from './ProductManager';

const MengHuanCenter = () => {
  return (
    <div className={styles.container}>
      <AutoSpeak />
      <ProductManager />
    </div>
  );
};

export default MengHuanCenter;
