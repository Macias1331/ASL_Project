import Homepage from "./Homepage";
import Login from "./Login";
import MenuScreen from "./MenuScreen";
import Signup from "./Signup";
import Auth from "./Auth";

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
    ]
  }
];

export default routes;