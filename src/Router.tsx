import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useMediaQuery } from '@mantine/hooks';
import { AppShell, em } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { HomePage } from './pages/Home.page';
import { GROUP, GROUPS, SIGNIN, SIGNOUT, SIGNUP, USER } from '@/routes';
import { useRootStore } from '@/stores/Root.store';
import UserPage from '@/pages/user/User.page';
import GroupPage from '@/pages/group/Group.page';
import GroupsPage from '@/pages/group/Groups.page';
import CreateGroupPage from '@/pages/group/CreateGroup.page';
import { Header } from '@/components/Shell/Header';
import Signin from '@/pages/auth/Signin.page';
import Signup from '@/pages/auth/Signup.page';
import Signout from '@/pages/auth/Signout.page';
import { Footer } from '@/components/Shell/Footer';
import ModifyGroupPage from '@/pages/group/ModifyGroup.page';
import ModifyUserPage from '@/pages/user/ModifyUser.page';

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
            <Route path={GROUPS} element={<GroupsPage />} />
            <Route path={`${GROUP}/:id`} element={<GroupPage />} />
            <Route path={`${GROUP}/:id/modify`} element={<ModifyGroupPage />} />
            <Route path={`${GROUP}/create`} element={<CreateGroupPage />} />
            <Route path={`${USER}/:username`} element={<UserPage />} />
            <Route path={`${USER}/me/modify`} element={<ModifyUserPage />} />
          </Routes>
          <Notifications position="bottom-right" pb="3%" />
        </AppShell.Main>
        <AppShell.Footer>
          <Footer />
        </AppShell.Footer>
      </AppShell>
    </BrowserRouter>
  );
}
