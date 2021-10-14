import styles from './index.module.scss';
import { GAME_TYPE_DATA_SOURCE } from './config';
import { useHistory, useRouteMatch } from 'react-router';

const GamesCenter = () => {
  const history = useHistory();
  const match = useRouteMatch();

  return (
    <div className={styles.container}>
      {GAME_TYPE_DATA_SOURCE.map(({ name, coverUrl, key, path }) => (
        <button
          onClick={() => history.push(`${match.path}${path}`)}
          key={key}
          className={styles.gameItemContainer}
        >
          <img className={styles.gameItemCover} src={coverUrl} />
          <span className={styles.gameItemName}>{name}</span>
        </button>
      ))}
    </div>
  );
};

export default GamesCenter;
