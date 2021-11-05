import styles from './index.module.scss';
import { FINANCE_TYPE_DATA_SOURCE } from './config';
import { useHistory, useRouteMatch } from 'react-router';

const FinanceCenter = () => {
  const history = useHistory();
  const match = useRouteMatch();

  return (
    <div className={styles.container}>
      {FINANCE_TYPE_DATA_SOURCE.map(({ name, coverUrl, key, path }) => (
        <button
          onClick={() => history.push(`${match.path}${path}`)}
          key={key}
          className={styles.financeItemContainer}
        >
          <img className={styles.financeItemCover} src={coverUrl} />
          <span className={styles.financeItemName}>{name}</span>
        </button>
      ))}
    </div>
  );
};

export default FinanceCenter;
