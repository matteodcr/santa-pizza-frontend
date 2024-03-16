import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import {
  BackgroundImage,
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Group,
  Modal,
  Skeleton,
  Space,
  Text,
  TextInput,
  Title,
  Tooltip,
  UnstyledButton,
  useMantineColorScheme,
} from '@mantine/core';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import { useDisclosure } from '@mantine/hooks';
import { IconCross, IconSettings, IconUpload, IconX } from '@tabler/icons-react';
import { useRootStore } from '@/stores/Root.store';
import PizzaComponent from '@/components/Group/PizzaComponent';
import GroupMembers from '@/components/Group/GroupMembers';
import { getDayDifference } from '@/utils/date';
import GroupTimeline from '@/components/Group/GroupTimeline';

const GroupPage: React.FC = observer(() => {
  const store = useRootStore();
  const location = useLocation();
  const navigate = useNavigate();
  const { colorScheme } = useMantineColorScheme();

  const [openedModal, setModal] = useDisclosure(false);
  const [openDescription, { open, close }] = useDisclosure(false);
  const [username, setUsername] = React.useState('');

  const { id } = useParams();
  const group = store.groupStore.getGroupById(Number(id));

  const imageBackground = () => {
    if (colorScheme === 'light') {
      return 'rgba(255, 255, 255, 0.6)';
    }
    return 'rgba(0, 0, 0, 0.6)';
  };

  async function fetchData() {
    const updatedGroup = await store.api.fetchGroup(Number(id));
    store.groupStore.updateGroups([updatedGroup]);
  }
  useEffect(() => {
    fetchData();
  }, []);

  const handleAddUser = async () => {
    try {
      store.groupStore.updateGroups([
        await store.api.addUser({
          groupId: Number(id),
          username,
        }),
      ]);
    } catch (e) {
      if ((e as Response).status === 404) {
        notifications.show({
          title: 'User not found',
          message: 'Please enter a valid username',
          icon: <IconX />,
          color: 'red',
        });
      } else if ((e as Response).status === 403) {
        notifications.show({
          title: 'User already in the group',
          message: 'Impossible to add this user',
          icon: <IconX />,
          color: 'red',
        });
      }
      throw e;
    }
  };

  const handleAssociateGroup = async () => {
    try {
      await store.api.associateGroup(Number(id));
      await fetchData();
    } catch (e) {
      notifications.show({
        title: `Erreur ${(e as Response).status}`,
        message: (e as Response).statusText,
        icon: <IconCross />,
      });
    }
  };

  return group ? (
    <>
      <Box py="md">
        <BackgroundImage
          src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-6.png"
          h={250}
          radius="xl"
        >
          <Flex
            mih={50}
            gap="md"
            justify="flex-end"
            align="flex-end"
            direction="column"
            wrap="wrap"
            h="100%"
          >
            <Box
              p="0.2em"
              style={{ borderRadius: '10px 0px 100% 0px', backgroundColor: imageBackground() }}
            >
              <UnstyledButton>
                <Group>
                  <IconUpload /> Upload <Space />
                </Group>
              </UnstyledButton>
            </Box>
          </Flex>
        </BackgroundImage>
      </Box>

      <Group>
        <Title order={1} lineClamp={1}>
          {group?.name}
        </Title>
        <Badge size="lg" variant="light">
          <Tooltip label={new Date(group?.dueDate!).toDateString()}>
            <Text>{getDayDifference(new Date(), new Date(group?.dueDate!))}</Text>
          </Tooltip>
        </Badge>
      </Group>
      <UnstyledButton onClick={openDescription ? close : open}>
        <Text lineClamp={openDescription ? 10 : 2}>{group?.description}</Text>
      </UnstyledButton>

      <Group>
        {group.status === 'OPEN' ? (
          <Button onClick={() => handleAssociateGroup()}>Associate pizzas</Button>
        ) : (
          <Button leftSection={<IconX />}>Close Group</Button>
        )}
        <Button
          variant="light"
          leftSection={<IconSettings />}
          onClick={() => navigate(`${location.pathname}/modify`)}
        >
          Settings
        </Button>
      </Group>

      {group.status === 'ASSOCIATED' ? (
        <>
          <PizzaComponent group={group} />
          <Divider my="lg" />
        </>
      ) : group.status === 'CLOSED' ? (
        <Text>Group is closed</Text>
      ) : (
        <></>
      )}

      <GroupTimeline group={group} />

      <GroupMembers open={setModal.open} />

      <Modal opened={openedModal} onClose={setModal.close} title="Add a new member">
        <TextInput
          placeholder="Enter the username"
          data-autofocus
          value={username}
          onChange={(event) => setUsername(event.currentTarget.value)}
        />
        <Button
          fullWidth
          onClick={() => {
            handleAddUser();
            setModal.close();
          }}
          mt="md"
        >
          Add
        </Button>
      </Modal>
    </>
  ) : (
    <Skeleton />
  );
});

export default GroupPage;
