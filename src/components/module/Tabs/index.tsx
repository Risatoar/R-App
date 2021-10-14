import { useHistory, useLocation } from 'react-router';
import styles from './index.module.scss';
import classNames from 'classnames';
import { TAB_DATA_SOURCE } from './config';

const routerMatch = (path: string, router: string) => router.split('/')[1] === path.split('/')[1]

const Home = () => {
  const history = useHistory();
  const location = useLocation();

  const handleTabClick = (path: string) => {
    if (!routerMatch(path, location.pathname)) {
      history.push(path);
    }
  };

  return (
    <div className={styles.container}>
      {TAB_DATA_SOURCE.map(({ path, Icon, name }) => (
        <button
          className={classNames(styles.tabContainer, {
            [styles.selected]: routerMatch(path, location.pathname),
          })}
          onClick={() => handleTabClick(path)}
        >
          <Icon />
          <span className={styles.tabName}>{name}</span>
        </button>
      ))}
    </div>
  );
};

export default Home;
