import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Textarea, TextInput } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useForm } from '@mantine/form';
import { DateTimePicker } from '@mantine/dates';
import { useRootStore } from '@/stores/Root.store';
import { CreateGroupData } from '@/stores/ApiStore';
import { DASHBOARD } from '@/routes';

const CreateGroup: React.FC = observer(() => {
  const store = useRootStore();
  const navigate = useNavigate();

  const handleCreateGroup = async () => {
    const createGroupData: CreateGroupData = {
      ...form.values,
      dueDate: form.values.dueDate.toISOString(),
    };

    await store.api.createGroup(createGroupData);
    navigate(DASHBOARD);
  };

  const [value, setValue] = useState<Date | null>(null);

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

  return (
    <>
      <form onSubmit={form.onSubmit((values) => console.log(values))}>
        <TextInput label="Name" placeholder="Enter group name" {...form.getInputProps('name')} />
        <Textarea
          label="Description"
          placeholder="Enter group description"
          {...form.getInputProps('description')}
        />
        <DateTimePicker
          label="Date Time Picker"
          placeholder="Pick date time"
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

export default CreateGroup;
