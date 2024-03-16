import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Avatar,
  Button,
  Center,
  Group,
  Skeleton,
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
import { UpdateUserData } from '@/stores/Api.store';
import 'react-advanced-cropper/dist/style.css';
import CropProfilePicture from '@/components/User/CropProfilePicture';
import getInitials from '@/utils/initials';

const ModifyUserPage: React.FC = observer(() => {
  const store = useRootStore();
  const navigate = useNavigate();
  const [allergies, setAllergies] = useState<string[]>([]);

  const user = store.userStore.getCurrentUser();

  const form = useForm({
    initialValues: {
      name: '',
      description: '',
    },
  });

  async function fetchData() {
    await store.loadCurrentUser();
    if (user?.name) {
      form.setFieldValue('name', user?.name);
    }
    if (user?.description) {
      form.setFieldValue('description', user?.description);
    }
    if (user?.allergies) {
      setAllergies(user?.allergies);
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

    navigate(`${USER}/${user?.username}`);
  };

  return (
    <>
      <form onSubmit={form.onSubmit((values) => console.log(values))}>
        <Title py="sm" order={1}>
          Edit user profile
        </Title>
        <Stack align="center">
          {user ? (
            <Avatar size={200} src={user.avatarUrl}>
              {getInitials(user?.name)}
            </Avatar>
          ) : (
            <Skeleton height={200} circle mb="xl" />
          )}

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
        <TagsInput py="md" data={[]} value={allergies} onChange={setAllergies} />
        <Center>
          <Group>
            <Button px="md" onClick={handleUpdate} mt="md">
              Submit
            </Button>
            <Button
              px="md"
              variant="outline"
              onClick={() => navigate(`${USER}/${user?.username}`)}
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
