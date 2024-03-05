import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { notifications } from '@mantine/notifications';
import { HomePage } from './pages/Home.page';
import Signin from '@/pages/auh/Signin.page';
import { DASHBOARD, GROUP, SIGNIN, SIGNOUT, SIGNUP, USER } from '@/routes';
import { useRootStore } from '@/stores/Root.store';
import Signup from '@/pages/auh/Signup.page';
import User, { User404 } from '@/pages/User.page';
import GroupPage from '@/pages/Group.page';
import Dashboard from '@/pages/Dashboard.page';
import { Header } from '@/components/Header';
import Signout from '@/pages/auh/Signout.page';

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
      <Header />
      <Routes>
        <Route index element={<HomePage />} />
        <Route path={SIGNIN} element={<Signin />} />
        <Route path={SIGNUP} element={<Signup />} />
        <Route path={SIGNOUT} element={<Signout />} />
        <Route path={DASHBOARD} element={<Dashboard />} />
        <Route path={`${GROUP}/:id`} element={<GroupPage />} />
        <Route path={`${USER}/:username`} element={<User />} />
        <Route path={`${USER}/404`} element={<User404 />} />
      </Routes>
    </BrowserRouter>
  );
}
