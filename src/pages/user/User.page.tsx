import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import {
  Alert,
  Avatar,
  Button,
  Center,
  Group,
  List,
  Paper,
  rem,
  Text,
  ThemeIcon,
} from '@mantine/core';
import { useNavigate, useParams } from 'react-router-dom';
import { IconInfoCircle, IconPencil, IconX } from '@tabler/icons-react';
import { useRootStore } from '@/stores/Root.store';
import { USER } from '@/routes';
import getInitials from '@/utils/initials';
import { showErrorNotification } from '@/utils/notification';

const UserPage: React.FC = observer(() => {
  const store = useRootStore();
  const navigate = useNavigate();
  const { username } = useParams();
  const user = store.userStore.getUserByUsername(username!);

  useEffect(() => {
    async function fetchData() {
      try {
        await store.loadUser(username!);
      } catch (e) {
        await showErrorNotification(e, 'Failed to fetch user');
        if ((e as Response).status === 404) {
          navigate('/404', { replace: true });
        }
      }
    }
    fetchData();
  }, [store.api]);

  return user ? (
    <Paper radius="md" p="lg" bg="var(--mantine-color-body)">
      <Center>
        <Avatar size={200} src={user.avatarUrl}>
          {getInitials(user.name)}
        </Avatar>
      </Center>
      <Text ta="center" fz="lg" fw={500} mt="md">
        {user.name}
      </Text>
      <Text ta="center" c="dimmed" fz="sm">
        @{user.username}
      </Text>
      <h3>Description</h3>
      {user.description}
      <h3>Allergies</h3>
      <List
        icon={
          <ThemeIcon color="red" size={15} radius="xl">
            <IconX style={{ width: rem(16), height: rem(16) }} />
          </ThemeIcon>
        }
        spacing="xs"
        size="sm"
        center
      >
        {user.allergies?.map((allergy, index) => (
          <List.Item key={index}>
            <Text size="sm">{allergy}</Text>
          </List.Item>
        ))}
      </List>
      {user.username === store.userStore.getCurrentUser()?.username && (
        <Group mt="lg" justify="center">
          <Button leftSection={<IconPencil />} onClick={() => navigate(`${USER}/me/modify`)}>
            Edit profile
          </Button>
        </Group>
      )}
    </Paper>
  ) : (
    <Text>Loading...</Text>
  );
});

export default UserPage;

export const User404: React.FC = () => {
  const icon = <IconInfoCircle />;
  return <Alert variant="filled" color="yellow" title="Utilisateur inconnu" icon={icon} />;
};
