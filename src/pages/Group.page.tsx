import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import {
  BackgroundImage,
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Group,
  Modal,
  Text,
  TextInput,
  Title,
  Tooltip,
  UnstyledButton,
} from '@mantine/core';
import { useParams } from 'react-router-dom';
import { runInAction } from 'mobx';
import { notifications } from '@mantine/notifications';
import { useDisclosure } from '@mantine/hooks';
import { IconCross, IconSettings, IconX } from '@tabler/icons-react';
import { useRootStore } from '@/stores/Root.store';
import PizzaComponent from '@/components/PizzaComponent';
import GroupMembers from '@/components/GroupMembers';
import { getDayDifference } from '@/utils/date';
import GroupTimeline from '@/components/GroupTimeline';

const GroupPage: React.FC = observer(() => {
  const store = useRootStore();
  const { id } = useParams();
  const indexStoredGroup = store.groupById(Number(id));
  const [openedModal, setModal] = useDisclosure(false);
  const [openDescription, { open, close }] = useDisclosure(false);

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
    try {
      await store.api.addUser({
        groupId: Number(id),
        username,
      });
    } catch (e) {
      if ((e as Response).status === 404) {
        notifications.show({
          title: 'User not found',
          message: 'Please enter a valid username',
          icon: <IconX />,
          color: 'red',
        });
      } else if ((e as Response).status === 403) {
        notifications.show({
          title: 'User already in the group',
          message: 'Impossible to add this user',
          icon: <IconX />,
          color: 'red',
        });
      } else {
        notifications.show({
          title: `Erreur ${(e as Response).status}`,
          message: (e as Response).statusText,
          icon: <IconX />,
          color: 'red',
        });
      }
    }

    await fetchData();
  };

  const handleAssociateGroup = async () => {
    try {
      console.log('id', id);
      await store.api.associateGroup(Number(id));
      await fetchData();
    } catch (e) {
      notifications.show({
        title: `Erreur ${(e as Response).status}`,
        message: (e as Response).statusText,
        icon: <IconCross />,
      });
    }
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
        icon: <IconCross />,
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
      <Box py="md">
        <BackgroundImage
          src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-6.png"
          h={250}
          radius="xl"
        >
          <Flex
            mih={50}
            gap="md"
            justify="flex-end"
            align="flex-start"
            direction="column"
            wrap="wrap"
            h="100%"
          >
            <Box p="1em" style={{ borderRadius: '0px 20px 0px 0px' }} />
          </Flex>
        </BackgroundImage>
      </Box>

      <Group>
        <Title order={1} lineClamp={1}>
          {store.groups[indexStoredGroup]?.name}
        </Title>
        <Badge size="lg" variant="light">
          <Tooltip label={new Date(store.groups[indexStoredGroup]?.dueDate).toDateString()}>
            <Text>
              {getDayDifference(new Date(), new Date(store.groups[indexStoredGroup]?.dueDate))}
            </Text>
          </Tooltip>
        </Badge>
      </Group>
      <UnstyledButton onClick={openDescription ? close : open}>
        <Text lineClamp={openDescription ? 10 : 2}>
          {store.groups[indexStoredGroup]?.description}
        </Text>
      </UnstyledButton>

      <Group>
        {store.groups[indexStoredGroup].status === 'OPEN' ? (
          <Button onClick={() => handleAssociateGroup()}>Associate pizzas</Button>
        ) : (
          <Button leftSection={<IconX />}>Close Group</Button>
        )}
        <Button variant="light" leftSection={<IconSettings />}>
          Settings
        </Button>
      </Group>

      {store.groups[indexStoredGroup].status === 'ASSOCIATED' ? (
        <>
          <PizzaComponent indexStoredGroup={indexStoredGroup} />
          <Divider my="lg" />
        </>
      ) : store.groups[indexStoredGroup].status === 'CLOSED' ? (
        <Text>Group is closed</Text>
      ) : (
        <></>
      )}

      <GroupTimeline group={store.groups[indexStoredGroup]} />

      <GroupMembers
        handleUpdateMember={handleUpdateMember}
        handleRemoveUser={handleRemoveUser}
        indexStoredGroup={indexStoredGroup}
        open={setModal.open}
      />

      <Modal opened={openedModal} onClose={setModal.close} title="Add a new member">
        <TextInput
          placeholder="Enter the username"
          data-autofocus
          value={username}
          onChange={(event) => setUsername(event.currentTarget.value)}
        />
        <Button
          fullWidth
          onClick={() => {
            handleAddUser();
            setModal.close();
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
