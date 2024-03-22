import React from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Textarea, TextInput } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useForm } from '@mantine/form';
import { DatePickerInput } from '@mantine/dates';
import { useRootStore } from '@/stores/Root.store';
import { CreateGroupData } from '@/stores/Api.store';
import { GROUPS } from '@/routes';
import { showErrorNotification, showSuccessNotification } from '@/utils/notification';

const CreateGroupPage: React.FC = observer(() => {
  const store = useRootStore();
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      name: '',
      description: '',
      dueDate: new Date(),
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

  const handleCreateGroup = async () => {
    try {
      const createGroupData: CreateGroupData = {
        ...form.values,
        dueDate: form.values.dueDate.toISOString(),
      };
      await store.api.createGroup(createGroupData);
      navigate(GROUPS);
      await showSuccessNotification('Group created successfully');
    } catch (e) {
      await showErrorNotification(e, 'Failed to create group');
    }
  };

  return (
    <>
      <form onSubmit={form.onSubmit((values) => console.log(values))}>
        <TextInput label="Name" placeholder="Enter group name" {...form.getInputProps('name')} />
        <Textarea
          label="Description"
          placeholder="Enter group description"
          {...form.getInputProps('description')}
        />
        <DatePickerInput
          label="Due date"
          placeholder="Pick event date"
          value={form.values.dueDate}
          onChange={(value) => {
            if (value instanceof Date) {
              form.setFieldValue('dueDate', value);
            }
          }}
        />
        <Button fullWidth onClick={handleCreateGroup} mt="md">
          Submit
        </Button>
      </form>
    </>
  );
});

export default CreateGroupPage;
