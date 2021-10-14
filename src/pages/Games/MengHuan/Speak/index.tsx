import styles from './index.module.scss';
import { Collapse } from 'antd';

const { Panel } = Collapse;

const AutoSpeak = () => {
  return <div className={styles.container}>
    <Collapse>
      <Panel header="自动喊话" key="autoSpeak">
        
      </Panel>
    </Collapse>
  </div>
};

export default AutoSpeak;