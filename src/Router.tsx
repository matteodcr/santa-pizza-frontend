import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useMediaQuery } from '@mantine/hooks';
import { em } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { HomePage } from './pages/Home.page';
import Signin from '@/pages/auh/Signin.page';
import { DASHBOARD, GROUP, SIGNIN, SIGNOUT, SIGNUP, USER } from '@/routes';
import { useRootStore } from '@/stores/Root.store';
import Signup from '@/pages/auh/Signup.page';
import User, { User404 } from '@/pages/User.page';
import GroupPage from '@/pages/Group.page';
import Dashboard from '@/pages/Dashboard.page';
import Signout from '@/pages/auh/Signout.page';
import CreateGroup from '@/pages/CreateGroup.page';
import { Header } from '@/components/Header';

export function Router() {
  const paddingPercentage = useMediaQuery(`(max-width: ${em(750)})`) ? '5%' : '20%';
  const store = useRootStore();
  function SetupUnauthorizedHandler() {
    const { api } = useRootStore();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
      api.onDisconnectedHandler = () => {
        if (location.pathname !== SIGNIN) {
          localStorage.removeItem('accessToken');
          store.reset();
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
      <div
        style={{
          paddingLeft: paddingPercentage,
          paddingRight: paddingPercentage,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Routes>
          <Route index element={<HomePage />} />
          <Route path={SIGNIN} element={<Signin />} />
          <Route path={SIGNUP} element={<Signup />} />
          <Route path={SIGNOUT} element={<Signout />} />
          <Route path={DASHBOARD} element={<Dashboard />} />
          <Route path={`${GROUP}/:id`} element={<GroupPage />} />
          <Route path={`${GROUP}/create`} element={<CreateGroup />} />
          <Route path={`${USER}/:username`} element={<User />} />
          <Route path={`${USER}/404`} element={<User404 />} />
        </Routes>
        <Notifications position="bottom-right" />
      </div>
    </BrowserRouter>
  );
}
