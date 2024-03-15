import React, { useState } from 'react';
import { Avatar, Button, Group, Menu, rem, Text } from '@mantine/core';
import { IconChevronDown, IconLogout, IconUser } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react';
import classes from './ProfileMenu.module.css';
import { SIGNOUT, USER } from '@/routes';
import { useRootStore } from '@/stores/Root.store';
import getInitials from '@/utils/initials';

export const ProfileMenu = observer(() => {
  const store = useRootStore();
  const navigate = useNavigate();
  const [userMenuOpened, setUserMenuOpened] = useState(false);

  const user = store.currentUser;

  return (
    <div className={classes.header}>
      <Menu
        width={260}
        position="bottom-end"
        transitionProps={{ transition: 'pop-top-right' }}
        onClose={() => setUserMenuOpened(false)}
        onOpen={() => setUserMenuOpened(true)}
        withinPortal
      >
        <Menu.Target>
          <Button variant="default">
            <Group gap={7}>
              <Avatar
                src={`${store.api.base_url}/${store.currentUser?.avatarUrl}`}
                variant="filled"
                size={30 || 'md'}
              >
                {getInitials(store.currentUser?.username)}
              </Avatar>
              <Text fw={500} size="sm" lh={1} mr={3}>
                {user?.username}
              </Text>
              <IconChevronDown style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
            </Group>
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            onClick={() => navigate(`${USER}/${user?.username}`)}
            leftSection={<IconUser style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
          >
            Your profile
          </Menu.Item>

          <Menu.Item
            color="red"
            onClick={() => navigate(SIGNOUT)}
            leftSection={<IconLogout style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
          >
            Sign out
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </div>
  );
});
