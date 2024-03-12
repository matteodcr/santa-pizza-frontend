import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { Alert, Avatar, Paper, Text } from '@mantine/core';
import { useNavigate, useParams } from 'react-router-dom';
import { IconInfoCircle } from '@tabler/icons-react';
import { useRootStore } from '@/stores/Root.store';
import { USER } from '@/routes';
import getInitials from '@/utils/initials';

const UserPage: React.FC = observer(() => {
  const store = useRootStore();
  const navigate = useNavigate();
  const { username } = useParams();
  const user = store.userByName(username!);

  useEffect(() => {
    async function fetchData() {
      try {
        store.updateUser([await store.api.fetchUser(username!)]);
      } catch (e) {
        if ((e as Response).status === 404) {
          navigate(`${USER}/404`, { replace: true });
        }
      }
    }
    fetchData();
  }, [store.api]);

  return user ? (
    <Paper radius="md" withBorder p="lg" bg="var(--mantine-color-body)">
      <Avatar size="xl" radius={120} mx="auto">
        {getInitials(user.name)}
      </Avatar>
      <Text ta="center" fz="lg" fw={500} mt="md">
        {user.name}
      </Text>
      <Text ta="center" c="dimmed" fz="sm">
        @{user.username}
      </Text>
      <h3>Description</h3>
      {user.description}
      <h3>Allergies</h3>
      {user.allergies}
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
