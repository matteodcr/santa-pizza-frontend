import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Badge, Button, Divider, Modal, Text, TextInput, Title } from '@mantine/core';
import { useParams } from 'react-router-dom';
import { runInAction } from 'mobx';
import { notifications } from '@mantine/notifications';
import { useDisclosure } from '@mantine/hooks';
import { useRootStore } from '@/stores/Root.store';
import PizzaComponent from '@/components/PizzaComponent';
import GroupMembers from '@/components/GroupMembers';

const GroupPage: React.FC = observer(() => {
  const store = useRootStore();
  const { id } = useParams();
  const indexStoredGroup = store.groupById(Number(id));
  const [opened, { open, close }] = useDisclosure(false);
  const [username, setUsername] = React.useState('');

  async function fetchData() {
    const updatedGroup = await store.api.fetchGroup(Number(id));
    runInAction(() => {
      store.groups[indexStoredGroup] = updatedGroup;
    });
  }
  useEffect(() => {
    fetchData();
  }, [store.api]);

  const handleAddUser = async () => {
    await store.api.addUser({
      groupId: Number(id),
      username,
    });
    await fetchData();
  };

  const handleRemoveUser = async (usernameToRemove: string) => {
    try {
      await store.api.removeUser({
        groupId: Number(id),
        username: usernameToRemove,
      });
      await fetchData();
    } catch (e) {
      notifications.show({
        title: `Erreur ${(e as Response).status}`,
        message: (e as Response).statusText,
      });
    }
  };

  const handleUpdateMember = async (role: string, usernameToUpdate: string, groupId: number) => {
    await store.api.changeRole({
      groupId,
      username: usernameToUpdate,
      role,
    });
    await fetchData();
  };

  return store.groups[indexStoredGroup] !== undefined ? (
    <>
      <Title order={1} lineClamp={1}>
        {store.groups[indexStoredGroup]?.name}
      </Title>
      <Title order={4} lineClamp={3}>
        {store.groups[indexStoredGroup]?.description}
      </Title>
      <Badge size="lg" variant="light">
        <Text>Due date: {new Date(store.groups[indexStoredGroup]?.dueDate).toLocaleString()}</Text>
      </Badge>
      <Divider my="lg" />

      {store.groups[indexStoredGroup].status === 'ASSOCIATED' ? (
        <PizzaComponent indexStoredGroup={indexStoredGroup} />
      ) : (
        <Text>Group is closed</Text>
      )}

      <Divider my="lg" />

      <GroupMembers
        handleUpdateMember={handleUpdateMember}
        handleRemoveUser={handleRemoveUser}
        indexStoredGroup={indexStoredGroup}
        open={open}
      />

      <Modal opened={opened} onClose={close} title="Authentication">
        <TextInput
          label="User to add"
          placeholder="Enter the username"
          data-autofocus
          value={username}
          onChange={(event) => setUsername(event.currentTarget.value)}
        />
        <Button
          fullWidth
          onClick={() => {
            handleAddUser();
            close();
          }}
          mt="md"
        >
          Add
        </Button>
      </Modal>
    </>
  ) : (
    <Text>Is loading</Text>
  );
});

export default GroupPage;
