import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Table, Textarea, TextInput } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { modals } from '@mantine/modals';
import { useForm } from '@mantine/form';
import { DatePickerInput } from '@mantine/dates';
import { useRootStore } from '@/stores/Root.store';
import { GROUP } from '@/routes';

const Dashboard: React.FC = observer(() => {
  const store = useRootStore();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      store.groups = await store.api.fetchGroups();
    }
    fetchData();
  }, [store.api]);

  //const handleCreateGroup = async () => {

  const form = useForm({
    initialValues: {
      name: '',
      description: '',
      dueDate: '',
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
      dueDate: (value: string) => {
        if (!value) {
          return 'Due date is required';
        }
        return undefined;
      },
    },
  });

  const rows = store.groups.map((group) => (
    <Table.Tr key={group.id} onClick={() => navigate(`${GROUP}/${group.id}`)}>
      <Table.Td>{group.name}</Table.Td>
      <Table.Td>{group.dueDate}</Table.Td>
      <Table.Td>{group.memberships.length}</Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Button
        onClick={() => {
          modals.open({
            title: 'Create a group',
            children: (
              <form onSubmit={form.onSubmit((values) => console.log(values))}>
                <TextInput
                  label="Name"
                  placeholder="Enter group name"
                  {...form.getInputProps('name')}
                />
                <Textarea
                  label="Description"
                  placeholder="Enter group description"
                  {...form.getInputProps('description')}
                />
                <DatePickerInput
                  popoverProps={{ zIndex: 10000 }}
                  valueFormat="YYYY-MM-DDTHH:mm:ssZ"
                  label="Pick date"
                  placeholder="Pick date"
                />
                <Button fullWidth onClick={() => modals.closeAll()} mt="md">
                  Submit
                </Button>
              </form>
            ),
          });
        }}
      >
        Create a group
      </Button>
      <Table highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Group name</Table.Th>
            <Table.Th>Due date</Table.Th>
            <Table.Th>Nombre de participants</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </>
  );
});

export default Dashboard;
