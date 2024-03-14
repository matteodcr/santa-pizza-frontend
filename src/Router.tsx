import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useMediaQuery } from '@mantine/hooks';
import { AppShell, em } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { HomePage } from './pages/Home.page';
import { DASHBOARD, GROUP, PIZZA, SIGNIN, SIGNOUT, SIGNUP, USER } from '@/routes';
import { useRootStore } from '@/stores/Root.store';
import UserPage from '@/pages/User.page';
import GroupPage from '@/pages/Group.page';
import DashboardPage from '@/pages/Dashboard.page';
import CreateGroupPage from '@/pages/CreateGroup.page';
import { Header } from '@/components/Header';
import PizzaPage from '@/pages/Pizza.page';
import Signin from '@/pages/auth/Signin.page';
import Signup from '@/pages/auth/Signup.page';
import Signout from '@/pages/auth/Signout.page';
import { Footer } from '@/components/Footer';

export function Router() {
  const paddingPercentage = useMediaQuery(`(max-width: ${em(750)})`) ? '5%' : '20%';
  const store = useRootStore();
  function SetupUnauthorizedHandler() {
    const { api } = useRootStore();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
      api.onDisconnectedHandler = () => {
        localStorage.removeItem('accessToken');
        store.reset();
        if (
          location.pathname !== SIGNIN &&
          location.pathname !== SIGNUP &&
          location.pathname !== '/'
        ) {
          navigate(SIGNIN);
        }
      };
    }, []);

    return <></>;
  }
  return (
    <BrowserRouter>
      <SetupUnauthorizedHandler />
      <AppShell
        header={{ height: '60px' }}
        footer={{ height: 60 }}
        pe={paddingPercentage}
        ps={paddingPercentage}
      >
        <AppShell.Header>
          <Header />
        </AppShell.Header>
        <AppShell.Main>
          <Routes>
            <Route index element={<HomePage />} />
            <Route path={SIGNIN} element={<Signin />} />
            <Route path={SIGNUP} element={<Signup />} />
            <Route path={SIGNOUT} element={<Signout />} />
            <Route path={DASHBOARD} element={<DashboardPage />} />
            <Route path={`${GROUP}/:id`} element={<GroupPage />} />
            <Route path={`${GROUP}/create`} element={<CreateGroupPage />} />
            <Route path={`${USER}/:username`} element={<UserPage />} />
            <Route path={`${USER}/:username`} element={<UserPage />} />
            <Route path={`${PIZZA}/:id`} element={<PizzaPage />} />
          </Routes>
          <Notifications position="bottom-right" />
        </AppShell.Main>
        <AppShell.Footer>
          <Footer />
        </AppShell.Footer>
      </AppShell>
    </BrowserRouter>
  );
}
