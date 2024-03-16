import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Center, Group, Text, Textarea, TextInput, Title } from '@mantine/core';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from '@mantine/form';
import { DatePickerInput } from '@mantine/dates';
import { useRootStore } from '@/stores/Root.store';
import { GROUP } from '@/routes';

const ModifyGroupPage: React.FC = observer(() => {
  const store = useRootStore();
  const navigate = useNavigate();

  const { id } = useParams();
  const group = store.groupStore.getGroupById(Number(id));

  const formName = useForm({
    initialValues: {
      name: '',
    },
    validate: {
      name: (value: string) => {
        if (!value) {
          return 'Name is required';
        }
        return undefined;
      },
    },
  });

  const formDescription = useForm({
    initialValues: {
      description: '',
    },
    validate: {
      description: (value: string) => {
        if (!value) {
          return 'Description is required';
        }
        return undefined;
      },
    },
  });

  const formDueDate = useForm({
    initialValues: {
      dueDate: new Date(),
    },
  });

  async function fetchData() {
    const updatedGroup = await store.api.fetchGroup(Number(id));
    store.groupStore.updateGroups([updatedGroup]);
    if (group?.name) {
      formName.setFieldValue('name', group?.name);
    }
    if (group?.description) {
      formDescription.setFieldValue('description', group?.description);
    }
    if (group?.dueDate) {
      formDueDate.setFieldValue('dueDate', new Date(group?.dueDate));
    }
  }

  useEffect(() => {
    fetchData();
  }, [store.api]);

  const handleUpdateGroupName = async () => {
    const name = {
      ...formName.values,
    };

    await store.api.updateGroupName(Number(id), name);
  };

  const handleUpdateGroupDescription = async () => {
    const description = {
      ...formDescription.values,
    };

    await store.api.updateGroupDescription(Number(id), description);
  };

  const handleUpdateGroupDueDate = async () => {
    const dueDate = {
      dueDate: formDueDate.values.dueDate.toISOString(),
    };

    return store.api.updateGroupDate(Number(id), dueDate);
  };

  const handleUpdate = async () => {
    await handleUpdateGroupName();
    await handleUpdateGroupDescription();

    const updatedGroup = await handleUpdateGroupDueDate();
    store.groupStore.updateGroups([updatedGroup]);

    navigate(`${GROUP}/${id}`);
  };

  return group !== undefined ? (
    <>
      <Title py="md" order={1}>
        Modify group
      </Title>
      <form onSubmit={formName.onSubmit((values) => console.log(values))}>
        <Group grow preventGrowOverflow={false}>
          <TextInput
            py="md"
            label="Name"
            width="10em"
            placeholder="Enter group name"
            {...formName.getInputProps('name')}
          />
        </Group>
        <Textarea
          py="md"
          label="Description"
          placeholder="Enter group description"
          autosize
          maxRows={4}
          {...formDescription.getInputProps('description')}
        />

        <DatePickerInput
          py="md"
          label="Due date"
          placeholder="Pick event date"
          value={formDueDate.values.dueDate}
          onChange={(value) => {
            if (value instanceof Date) {
              formDueDate.setFieldValue('dueDate', value);
            }
          }}
        />
        <Center>
          <Group>
            <Button px="md" onClick={handleUpdate} mt="md">
              Submit
            </Button>
            <Button px="md" variant="outline" onClick={() => navigate(`${GROUP}/${id}`)} mt="md">
              Cancel
            </Button>
          </Group>
        </Center>
      </form>
    </>
  ) : (
    <Text>Is loading</Text>
  );
});

export default ModifyGroupPage;
