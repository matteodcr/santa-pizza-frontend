import React, { Fragment, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Group as GroupMantine, Skeleton, Table, Text } from '@mantine/core';
import { useNavigate, useParams } from 'react-router-dom';
import { useRootStore } from '@/stores/Root.store';
import AvatarBadge from '@/components/AvatarBadge';

const GroupPage: React.FC = observer(() => {
  const store = useRootStore();
  const navigate = useNavigate();
  const { id } = useParams();
  const indexStoredGroup = store.groupById(Number(id));

  useEffect(() => {
    console.log('test');
    async function fetchData() {
      store.groups[indexStoredGroup] = await store.api.fetchGroup(Number(id));
    }
    fetchData();
  }, [store.api]);

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
      <h1>{store.groups[indexStoredGroup]?.name}</h1>
      <sub>{store.groups[indexStoredGroup]?.description}</sub>

      <p>Creation date: {store.groups[indexStoredGroup]?.createdAt}</p>
      <p>Due date: {store.groups[indexStoredGroup]?.dueDate}</p>

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
    </>
  );
});

export default GroupPage;
