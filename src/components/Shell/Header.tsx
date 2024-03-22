import { Box, Burger, Button, Divider, Drawer, Group, rem, ScrollArea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPizza } from '@tabler/icons-react';
import { observer } from 'mobx-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import classes from './Header.module.css';
import { GROUPS, SIGNIN, SIGNUP } from '@/routes';
import { ProfileMenu } from '@/components/Shell/ProfileMenu';
import { useRootStore } from '@/stores/Root.store';
import { ColorSchemeToggle } from '@/components/ColorSchemeToggle/ColorSchemeToggle';

export const Header = observer(() => {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const navigate = useNavigate();
  const store = useRootStore();

  const currentUser = store.userStore.getCurrentUser();

  useEffect(() => {
    async function loadCurrentUser() {
      await store.loadCurrentUser();
    }
    loadCurrentUser();
  }, [store.api]);

  return (
    <Box>
      <div className={classes.header}>
        <Group justify="space-between" h="100%">
          <Group>
            <Button
              color="black"
              variant="default"
              size="compact-xl"
              style={{ borderColor: 'transparent', backgroundColor: 'transparent' }}
              leftSection={<IconPizza size={30} />}
              onClick={() => navigate('/')}
            >
              Pizza Party
            </Button>
          </Group>

          <Group h="100%" gap={0} visibleFrom="sm">
            <a href={GROUPS} className={classes.link}>
              Groups
            </a>
          </Group>

          <Group>
            <ColorSchemeToggle />
            {!currentUser ? (
              <Group visibleFrom="sm">
                <Button variant="default" onClick={() => navigate(SIGNIN)}>
                  Log in
                </Button>
                <Button onClick={() => navigate(SIGNUP)}>Sign up</Button>
              </Group>
            ) : (
              <ProfileMenu />
            )}
          </Group>

          <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" />
        </Group>
      </div>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Navigation"
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
          <Divider my="sm" />

          <a href={GROUPS} className={classes.link}>
            Groups
          </a>

          <Divider my="sm" />

          <Group justify="center" grow pb="xl" px="md">
            <Button variant="default" onClick={() => navigate(SIGNIN)}>
              Log in
            </Button>
            <Button onClick={() => navigate(SIGNUP)}>Sign up</Button>
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  );
});
