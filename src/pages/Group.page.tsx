import React, { Fragment, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import {
  ActionIcon,
  Anchor,
  Badge,
  Button,
  Divider,
  Flex,
  Group as GroupMantine,
  Modal,
  Skeleton,
  Table,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useNavigate, useParams } from 'react-router-dom';
import { runInAction } from 'mobx';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useRootStore } from '@/stores/Root.store';
import AvatarBadge from '@/components/AvatarBadge';
import { USER } from '@/routes';

const GroupPage: React.FC = observer(() => {
  const store = useRootStore();
  const navigate = useNavigate();
  const { id } = useParams();
  const indexStoredGroup = store.groupById(Number(id));
  const [username, setUsername] = React.useState('');
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    fetchData();
  }, [store.api]);

  async function fetchData() {
    const updatedGroup = await store.api.fetchGroup(Number(id));
    runInAction(() => {
      store.groups[indexStoredGroup] = updatedGroup;
    });
  }

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

  const isRemovable = (usernameToCheck: string): boolean =>
    store.currentUser?.username !== usernameToCheck ||
    store.groups[indexStoredGroup]?.memberships.find(
      (membership) => membership.user.username === usernameToCheck
    )?.role === 'USER';

  const rows =
    store.groups[indexStoredGroup] !== undefined ? (
      store.groups[indexStoredGroup].memberships.map((membership) => (
        <Table.Tr key={membership.id}>
          <Table.Td>
            <Flex mih={50} gap="md" justify="flex-start" align="center" direction="row" wrap="wrap">
              <AvatarBadge user={membership.user} />
              <Anchor onClick={() => navigate(`${USER}/${membership.user.username}`)}>
                <Text fz="sm" fw={500}>
                  {membership.user.name}
                </Text>
                <Text fz="xs" c="dimmed">
                  @{membership.user.username}
                </Text>
              </Anchor>
              {membership.role === 'ADMIN' ? (
                <Badge
                  size="lg"
                  variant="gradient"
                  gradient={{ from: 'orange', to: 'yellow', deg: 90 }}
                >
                  Admin
                </Badge>
              ) : (
                <div />
              )}
            </Flex>
          </Table.Td>

          <Table.Td>
            {isRemovable(membership.user.username) ? (
              <Flex mih={50} gap="md" justify="flex-end" align="center" direction="row" wrap="wrap">
                <ActionIcon
                  variant="light"
                  color="red"
                  size="xl"
                  onClick={() => handleRemoveUser(membership.user.username)}
                >
                  <IconTrash size={14} />
                </ActionIcon>
              </Flex>
            ) : (
              <div />
            )}
          </Table.Td>
        </Table.Tr>
      ))
    ) : (
      <Table.Tr key={1}>
        <Table.Td>
          <GroupMantine gap="sm">
            <Skeleton height={50} circle mb="xl" />
            <>
              <Skeleton height={8} mt={6} width="30%" radius="xl" />
            </>
          </GroupMantine>
        </Table.Td>

        <Table.Td>
          <Skeleton height={8} mt={6} width="70%" radius="xl" />
        </Table.Td>
      </Table.Tr>
    );

  return (
    <>
      <Title order={1} lineClamp={1}>
        {store.groups[indexStoredGroup]?.name}
      </Title>
      <Title order={4} lineClamp={3}>
        {store.groups[indexStoredGroup]?.description}
        <Divider my="lg" />
      </Title>

      <Text>
        Creation date: {new Date(store.groups[indexStoredGroup]?.createdAt).toDateString()}
      </Text>
      <Text>Due date: {new Date(store.groups[indexStoredGroup]?.dueDate).toDateString()}</Text>

      <Table.ScrollContainer minWidth={100}>
        <Table verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Member</Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      <Button variant="light" onClick={open} leftSection={<IconPlus size={14} />}>
        Add user
      </Button>
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
  );
});

export default GroupPage;
