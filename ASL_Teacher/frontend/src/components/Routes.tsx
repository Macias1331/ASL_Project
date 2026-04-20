import Login from "./Login";
import MenuScreen from "./MenuScreen";
import Signup from "./Signup";
import Auth from "./Auth";
import Store from "./Store";
import Friends from "./Friends";
import Settings from "./Settings";
import Error from "./Error";
import DressingRoom from "./DressingRoom";
import { HandsRecorder } from "./HandsRecorder/HandsRecorder";
import Achievements from "./Achievements";
import MiniGames from "./MiniGames";
import AlphabetPractice from "./AlphabetPractice";
import InboxScreen from "./Inbox";
import Spellingbee from "./Spellingbee"; 
import BattlePass from "./Battlepass";
import PurchaseItems from "./PurchaseItems"
import PurchaseChub from "./PurchaseChub";

const routes = [
  {
    path: '/',
    element: <Login />
  },
  {
    path: '/Signup',
    element: <Signup />
  },

  //Protected Routes
  {
    element: <Auth />,
    children: [
      {
        path: '/menu',
        element: <MenuScreen />
      },
      {
        path: '/store',
        element: <Store />
      },
      {
        path: '/friends',
        element: <Friends />
      },
      {
        path: '/settings',
        element: <Settings />
      },
      {
        path: '/learning-mode',
        element: <AlphabetPractice />
      },
      {
        path: '/dressing-room',
        element: <DressingRoom />
      },
      {
        path: '/achievements',
        element: <Achievements />
      },
      {
        path: '/hands',
        element: <HandsRecorder />
      },
      {
        path: '/mini-games',
        element: <MiniGames />
      },
      {
        path: '/Inbox',
        element: <InboxScreen />
      },
      {
        path: '/mini-games/spelling-bee', 
        element: <Spellingbee />
      },
      {
        path: '/battle-pass',
        element: <BattlePass />
      },
      {
        path: '/purchase',
        element: <PurchaseItems />
      },
      {
        path: "/purchaseChub",
        element: <PurchaseChub />
      }
    ]
  },

  //404 Route
  {
    path: '*',
    element: <Error />
  },
  {
    path: '/practice-alphabet',
    element: <AlphabetPractice />
  },
];

export default routes;