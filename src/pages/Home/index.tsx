import styles from './index.module.scss';
import TopBar from './TopBar';

const Home = () => {
  return <div className={styles.container}>
    <TopBar />
  </div>
}

export default Home;