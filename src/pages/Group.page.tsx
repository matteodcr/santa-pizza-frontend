import React, { Fragment, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Button,
  Group as GroupMantine,
  Modal,
  Skeleton,
  Table,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useParams } from 'react-router-dom';
import { runInAction } from 'mobx';
import { IconPlus } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useRootStore } from '@/stores/Root.store';
import AvatarBadge from '@/components/AvatarBadge';

const GroupPage: React.FC = observer(() => {
  const store = useRootStore();
  const { id } = useParams();
  const indexStoredGroup = store.groupById(Number(id));
  const [username, setUsername] = React.useState('');
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    async function fetchData() {
      const updatedGroup = await store.api.fetchGroup(Number(id));
      runInAction(() => {
        store.groups[indexStoredGroup] = updatedGroup;
      });
    }
    fetchData();
  }, [store.api]);

  const handleAddUser = async () => {
    await store.api.addUser({
      groupId: Number(id),
      username,
    });
  };

  const rows =
    store.groups[indexStoredGroup] !== undefined ? (
      store.groups[indexStoredGroup].memberships.map((membership) => (
        <Table.Tr key={membership.id}>
          <Table.Td>
            <GroupMantine gap="sm">
              <AvatarBadge user={membership.user} />
              <>
                <Text fz="sm" fw={500}>
                  {membership.user.name}
                </Text>
                <Text fz="xs" c="dimmed">
                  @{membership.user.username}
                </Text>
              </>
            </GroupMantine>
          </Table.Td>

          <Table.Td>{membership.role}</Table.Td>
        </Table.Tr>
      ))
    ) : (
      <Table.Tr key={1}>
        <Table.Td>
          <GroupMantine gap="sm">
            <Skeleton height={50} circle mb="xl" />
            <>
              <Skeleton height={8} mt={6} width="70%" radius="xl" />
            </>
          </GroupMantine>
        </Table.Td>

        <Table.Td>
          {' '}
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
      </Title>

      <Text>
        Creation date: {new Date(store.groups[indexStoredGroup]?.createdAt).toDateString()}
      </Text>
      <Text>Due date: {new Date(store.groups[indexStoredGroup]?.dueDate).toDateString()}</Text>

      <Table.ScrollContainer minWidth={800}>
        <Table verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Employee</Table.Th>
              <Table.Th>Role</Table.Th>
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
