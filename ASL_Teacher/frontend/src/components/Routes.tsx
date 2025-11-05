import Homepage from "./Homepage";
import Login from "./Login";
import MenuScreen from "./MenuScreen";
import Signup from "./Signup";
import Auth from "./Auth";
import Store from "./Store";
import Friends from "./Friends";
import Settings from "./Settings";
import Game from "./Game";
import Error from "./Error";
import DressingRoom from "./DressingRoom";
import { HandsRecorder } from "./HandsRecorder/HandsRecorder";

const routes = [
  {
    path: '/',
    element: <Homepage />
  },
  {
    path: '/login',
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
        path: '/game',
        element: <Game />
      },
      {
        path: '/dressing-room',
        element: <DressingRoom />
      },
      {
        path: '/hands',
        element: <HandsRecorder />
      }
    ]
  },

  //404 Route
  {
    path: '*',
    element: <Error />
  }
];

export default routes;