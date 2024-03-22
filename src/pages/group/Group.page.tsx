import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import {
  BackgroundImage,
  Badge,
  Box,
  Button,
  Divider,
  Group,
  Modal,
  Skeleton,
  Text,
  TextInput,
  Title,
  Tooltip,
  UnstyledButton,
  useMantineColorScheme,
} from '@mantine/core';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDisclosure } from '@mantine/hooks';
import { IconArchive, IconPencil } from '@tabler/icons-react';
import { useRootStore } from '@/stores/Root.store';
import PizzaComponent from '@/components/Group/PizzaComponent';
import GroupMembers from '@/components/Group/GroupMembers';
import { getDayDifference } from '@/utils/date';
import GroupTimeline from '@/components/Group/GroupTimeline';
import { showErrorNotification, showSuccessNotification } from '@/utils/notification';
import { GroupBadge } from '@/components/Group/GroupCard';
import { Membership } from '@/stores/entity/Membership';

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
  const currentUser = store.userStore.getCurrentUser();
  let membership: Membership | undefined;
  if (group && currentUser) {
    membership = store.groupStore.getUserMembership(group, currentUser!);
  }

  async function fetchData() {
    try {
      const updatedGroup = await store.api.fetchGroup(Number(id));
      store.groupStore.updateGroups([updatedGroup]);
    } catch (e) {
      await showErrorNotification(e, 'Failed to fetch group');
    }
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
      await showSuccessNotification('User added successfully');
    } catch (e) {
      await showErrorNotification(e, 'Failed to add user');
    }
    setUsername('');
  };

  const handleAssociateGroup = async () => {
    try {
      await store.api.associateGroup(Number(id));
      await fetchData();
      await showSuccessNotification('Group associated successfully');
    } catch (e) {
      await showErrorNotification(e, 'Failed to associate group');
    }
  };

  const handleCloseGroup = async () => {
    try {
      await store.api.closeGroup(Number(id));
      await fetchData();
      await showSuccessNotification('Group archived successfully');
    } catch (e) {
      await showErrorNotification(e, 'Failed to archive group');
    }
  };

  return group ? (
    <>
      <Box py="md">
        {group.backgroundUrl! ? (
          <BackgroundImage src={group.backgroundUrl!} h={350} radius="xl">
            <GroupBadge status={group.status!} />
          </BackgroundImage>
        ) : (
          <Box
            h={350}
            w="100%"
            p={0}
            style={{ borderRadius: 'calc(2rem * 1)' }}
            bg="var(--mantine-color-blue-light)"
          >
            <GroupBadge status={group.status!} />
          </Box>
        )}
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

      {membership?.role === 'ADMIN' && (
        <Group>
          {group.status === 'OPEN' ? (
            <Button onClick={() => handleAssociateGroup()}>Associate pizzas</Button>
          ) : (
            group.status === 'ASSOCIATED' && (
              <Button onClick={() => handleCloseGroup()} leftSection={<IconArchive />}>
                Archive
              </Button>
            )
          )}
          <Button
            variant="light"
            leftSection={<IconPencil />}
            onClick={() => navigate(`${location.pathname}/modify`)}
          >
            Modify
          </Button>
        </Group>
      )}

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
