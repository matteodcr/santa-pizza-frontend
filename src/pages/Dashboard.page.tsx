import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Anchor, Button, Group, Table } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useForm } from '@mantine/form';
import { runInAction } from 'mobx';
import { useRootStore } from '@/stores/Root.store';
import { GROUP } from '@/routes';
import AvatarBadge from '@/components/AvatarBadge';

const Dashboard: React.FC = observer(() => {
  const store = useRootStore();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const groups = await store.api.fetchGroups();
      runInAction(() => {
        store.groups = groups;
      });
      console.log(store.groups);
    }
    fetchData();
  }, [store.api]);

  const [value, setValue] = useState<Date | null>(null);

  const form = useForm({
    initialValues: {
      name: '',
      description: '',
    },
    validate: {
      name: (value: string) => {
        if (!value) {
          return 'Name is required';
        }
        return undefined;
      },
      description: (value: string) => {
        if (!value) {
          return 'Description is required';
        }
        return undefined;
      },
    },
  });

  const rows = store.groups.map((group) => (
    <Table.Tr
      key={group.id}
      onClick={() => navigate(`${GROUP}/${group.id}`)}
      style={{ cursor: 'pointer' }}
    >
      <Table.Td>
        <Anchor>{group.name}</Anchor>
      </Table.Td>
      <Table.Td>{new Date(group.dueDate).toDateString()}</Table.Td>

      <Table.Td key={group.id}>
        <Group gap="sm">
          {group.memberships.map((membership) => (
            <AvatarBadge key={membership.id} user={membership.user} />
          ))}
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Button onClick={() => navigate(`${GROUP}/create`)} mt="md">
        New group
      </Button>
      <Table highlightOnHover striped verticalSpacing="lg">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Group name</Table.Th>
            <Table.Th>Due date</Table.Th>
            <Table.Th>Members</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </>
  );
});

export default Dashboard;