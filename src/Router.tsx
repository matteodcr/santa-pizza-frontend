import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { notifications } from '@mantine/notifications';
import { HomePage } from './pages/Home.page';
import Signin from '@/pages/Signin.page';
import { GROUP, SIGNIN, SIGNUP } from '@/routes';
import GroupPage from '@/pages/Group.page';
import { useRootStore } from '@/stores/Root.store';
import Signup from '@/pages/Signup.page';

export function Router() {
  function SetupUnauthorizedHandler() {
    const { api } = useRootStore();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
      api.onDisconnectedHandler = () => {
        if (location.pathname !== SIGNIN) {
          notifications.show({
            title: 'Default notification',
            message: 'Hey there, your code is awesome! 🤥',
          });
          navigate(SIGNIN);
        }
      };
    }, []);

    return <></>;
  }
  return (
    <BrowserRouter>
      <SetupUnauthorizedHandler />
      <Routes>
        <Route index element={<HomePage />} />
        <Route path={SIGNIN} element={<Signin />} />
        <Route path={SIGNUP} element={<Signup />} />
        <Route path={GROUP} element={<GroupPage />} />
      </Routes>
    </BrowserRouter>
  );
}
