import Dashboard from "../pages/Dashboard";
import PlayerPool from '../pages/PlayerPool';
import Lottery from "../pages/Lottery";
import DraftPlayer from "../pages/DraftPlayer";
import ViewDraft from "../pages/ViewDraft";

const coreRoutes = [
  {
    path: '/',
    component: Dashboard
  },
  {
    path: '/players',
    component: PlayerPool
  },
  {
    path: '/lottery',
    component: Lottery
  },
  {
    path: '/draft_player',
    component: DraftPlayer
  },
  {
    path: '/view_draft',
    component: ViewDraft
  }
];

const routes = [...coreRoutes];
export default routes;