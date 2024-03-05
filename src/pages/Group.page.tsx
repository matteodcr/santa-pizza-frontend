import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Table } from '@mantine/core';
import { useRootStore } from '@/stores/Root.store';

const Groups: React.FC = observer(() => {
  const store = useRootStore();

  useEffect(() => {
    async function fetchData() {
      store.groups = await store.api.fetchGroups();
    }
    fetchData();
  }, [store.api]);

  const rows = store.groups.map((group) => (
    <Table.Tr key={group.id}>
      <Table.Td>{group.name}</Table.Td>
      <Table.Td>{group.dueDate}</Table.Td>
      <Table.Td>{group.memberships.length}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Group name</Table.Th>
          <Table.Th>Due date</Table.Th>
          <Table.Th>Nombre de participants</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
});

export default Groups;
