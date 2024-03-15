import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Avatar,
  Button,
  Center,
  Group,
  Stack,
  TagsInput,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useForm } from '@mantine/form';
import { useRootStore } from '@/stores/Root.store';
import { USER } from '@/routes';
import { UpdateUserData } from '@/stores/ApiStore';
import 'react-advanced-cropper/dist/style.css';
import CropProfilePicture from '@/components/CropProfilePicture';
import getInitials from '@/utils/initials';

const ModifyUserPage: React.FC = observer(() => {
  const store = useRootStore();
  const navigate = useNavigate();
  const [allergies, setAllergies] = useState<string[]>([]);

  const form = useForm({
    initialValues: {
      name: '',
      description: '',
    },
  });

  async function fetchData() {
    await store.loadCurrentUser();
    if (store.currentUser?.name) {
      form.setFieldValue('name', store.currentUser.name);
    }
    if (store.currentUser?.description) {
      form.setFieldValue('description', store.currentUser.description);
    }
    if (store.currentUser?.allergies) {
      setAllergies(store.currentUser.allergies);
    }
  }
  useEffect(() => {
    fetchData();
  }, [store]);

  const handleUpdate = async () => {
    const updateUserData: UpdateUserData = {
      ...form.values,
      allergies,
    };

    await store.api.updateUser(updateUserData);
    navigate(`${USER}/${store.currentUser?.username}`);
  };

  return (
    <>
      <form onSubmit={form.onSubmit((values) => console.log(values))}>
        <Title py="sm" order={1}>
          Edit user profile
        </Title>
        <Stack align="center">
          <Avatar size={200} src={`${store.api.base_url}/${store.currentUser?.avatarUrl}`}>
            {getInitials(store.currentUser?.name)}
          </Avatar>
          <CropProfilePicture />
        </Stack>
        <TextInput
          py="md"
          label="Name"
          width="10em"
          placeholder="Enter username"
          {...form.getInputProps('name')}
        />
        <Textarea
          py="md"
          label="Description"
          placeholder="Enter group description"
          autosize
          maxRows={4}
          {...form.getInputProps('description')}
        />
        <TagsInput data={[]} value={allergies} onChange={setAllergies} />
        <Center>
          <Group>
            <Button px="md" onClick={handleUpdate} mt="md">
              Submit
            </Button>
            <Button
              px="md"
              variant="outline"
              onClick={() => navigate(`${USER}/${store.currentUser?.username}`)}
              mt="md"
            >
              Cancel
            </Button>
          </Group>
        </Center>
      </form>
    </>
  );
});

export default ModifyUserPage;
