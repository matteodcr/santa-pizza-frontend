import cx from 'clsx';
import { useEffect, useState } from 'react';
import {
  Avatar,
  Burger,
  Container,
  Group,
  Menu,
  rem,
  Tabs,
  Text,
  UnstyledButton,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronDown, IconLogout, IconUser } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import classes from './Header.module.css';
import logo from '../favicon.svg';
import { DASHBOARD, SIGNIN, SIGNOUT, USER } from '@/routes';
import { useRootStore } from '@/stores/Root.store';

const tabs = [{ name: 'Dashboard', url: DASHBOARD }];

export function Header() {
  const store = useRootStore();
  const navigate = useNavigate();
  const [opened, { toggle }] = useDisclosure(false);
  const [userMenuOpened, setUserMenuOpened] = useState(false);

  useEffect(() => {
    async function loadCurrentUser() {
      if (!store.currentUser) {
        await store.loadCurrentUser();
      }
    }
    loadCurrentUser();
  }, [store.api]);

  const isSignupOrDashboard = () => {
    const currentPath = window.location.pathname;
    return currentPath === SIGNOUT || currentPath === SIGNIN || currentPath === '/';
  };

  if (isSignupOrDashboard()) {
    return null;
  }
  const items = tabs.map((tab) => (
    <Tabs.Tab value={tab.name} key={tab.name} onClick={() => navigate(tab.url)}>
      {tab.name}
    </Tabs.Tab>
  ));

  return (
    <div className={classes.header}>
      <Container className={classes.mainSection} size="md">
        <Group justify="space-between">
          <Avatar src={logo} size={28} />

          <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />

          <Menu
            width={260}
            position="bottom-end"
            transitionProps={{ transition: 'pop-top-right' }}
            onClose={() => setUserMenuOpened(false)}
            onOpen={() => setUserMenuOpened(true)}
            withinPortal
          >
            <Menu.Target>
              <UnstyledButton
                className={cx(classes.user, { [classes.userActive]: userMenuOpened })}
              >
                <Group gap={7}>
                  <Avatar alt={store.currentUser?.name} radius="xl" size={20} />
                  <Text fw={500} size="sm" lh={1} mr={3}>
                    {store.currentUser?.name}
                  </Text>
                  <IconChevronDown style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
                </Group>
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                onClick={() => navigate(`${USER}/${store.currentUser?.username}`)}
                leftSection={<IconUser style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
              >
                Your profile
              </Menu.Item>

              <Menu.Item
                color="red"
                onClick={() => navigate(SIGNOUT)}
                leftSection={
                  <IconLogout style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                }
              >
                Sign out
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Container>
      <Container size="md">
        <Tabs
          defaultValue={tabs[0].name}
          variant="outline"
          visibleFrom="sm"
          classNames={{
            root: classes.tabs,
            list: classes.tabsList,
            tab: classes.tab,
          }}
        >
          <Tabs.List>{items}</Tabs.List>
        </Tabs>
      </Container>
    </div>
  );
}
