import Home from '@/pages/Home';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import Tabs from '@/components/module/Tabs';
import GamesCenter from '@/pages/Games';
import MengHuanCenter from './pages/Games/MengHuan';
import styles from './App.module.scss';
import 'antd/dist/antd.css';
import { RecoilRoot } from 'recoil';

function App() {
  return (
    <RecoilRoot>
      <BrowserRouter>
        <Switch>
          <div className={styles.app}>
            <Tabs />
            <div className={styles.container}>
              <Route path="/" exact={true}>
                <Home />
              </Route>
              <Route path="/game" exact={true}>
                <GamesCenter />
              </Route>
              <Route path="/game/menghuan" exact={true}>
                <MengHuanCenter />
              </Route>
            </div>
          </div>
        </Switch>
      </BrowserRouter>
    </RecoilRoot>
  );
}

export default App;
