import { ActionIcon, Anchor, Avatar, Flex, Table, Text, Title } from '@mantine/core';
import { IconArrowUp, IconTrash, IconUserPlus, IconX } from '@tabler/icons-react';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import { observer } from 'mobx-react';
import AvatarBadge from '@/components/AvatarBadge';
import { USER } from '@/routes';
import { useRootStore } from '@/stores/Root.store';
import { Group } from '@/stores/entity/Group';
import { Membership } from '@/stores/entity/Membership';

interface GroupMembersRowProps {
  group: Group;
  membership: Membership;
}

const GroupMembersRow = observer(({ group, membership }: GroupMembersRowProps) => {
  const store = useRootStore();
  const navigate = useNavigate();

  const currentUser = store.userStore.getCurrentUser();

  const handleRemoveUser = async (usernameToRemove: string) => {
    try {
      await store.api.removeUser({
        groupId: group.id!,
        username: usernameToRemove,
      });
      await store.loadGroup(group.id!);
    } catch (e) {
      notifications.show({
        title: `Erreur ${(e as Response).status}`,
        message: (e as Response).statusText,
        color: 'red',
        icon: <IconX />,
      });
    }
  };

  const handleUpdateMember = async (role: string, usernameToUpdate: string, groupId: number) => {
    try {
      await store.api.changeRole({
        groupId,
        username: usernameToUpdate,
        role,
      });
      await store.loadGroup(groupId);
    } catch (e) {
      notifications.show({
        title: `Erreur ${(e as Response).status}`,
        message: (e as Response).statusText,
        color: 'red',
        icon: <IconX />,
      });
    }
  };

  return (
    <Table.Tr>
      <Table.Td>
        <Flex mih={50} gap="md" justify="flex-start" align="center" direction="row" wrap="wrap">
          <AvatarBadge user={membership.user!} admin={membership.role === 'ADMIN'} />
          <Anchor onClick={() => navigate(`${USER}/${membership.user!.username}`)}>
            <Text fz="sm" fw={500}>
              {membership.user!.name}
            </Text>
            <Text fz="xs" c="dimmed">
              @{membership.user!.username}
            </Text>
          </Anchor>
        </Flex>
      </Table.Td>

      <Table.Td>
        {currentUser && store.groupStore.isRemovable(membership.user!, currentUser!, group) ? (
          <Flex mih={50} gap="md" justify="flex-end" align="center" direction="row" wrap="wrap">
            {membership.role === 'USER' ? (
              <ActionIcon
                variant="light"
                color="blue"
                size="xl"
                onClick={() => handleUpdateMember('ADMIN', membership.user?.username!, group.id!)}
              >
                <IconArrowUp size={14} />
              </ActionIcon>
            ) : (
              <> </>
            )}
            {group.status === 'OPEN' ? (
              <ActionIcon
                variant="light"
                color="red"
                size="xl"
                onClick={() => handleRemoveUser(membership.user?.username!)}
              >
                <IconTrash size={14} />
              </ActionIcon>
            ) : (
              <></>
            )}
          </Flex>
        ) : (
          <div />
        )}
      </Table.Td>
    </Table.Tr>
  );
});

interface GroupMembersProps {
  open: () => void;
}

const GroupMembers = observer(({ open }: GroupMembersProps) => {
  const store = useRootStore();

  const { id } = useParams();
  const group = store.groupStore.getGroupById(Number(id));

  const rows = group.memberships.map((membership) => (
    <GroupMembersRow key={membership.id} membership={membership} group={group} />
  ));
  return (
    <>
      <Title order={3}>Members</Title>

      <Table.ScrollContainer minWidth={100} py="md">
        <Table verticalSpacing="sm" withRowBorders={false} highlightOnHover>
          <Table.Tbody>
            {rows}
            <Table.Tr key="add" onClick={open} style={{ cursor: 'pointer' }}>
              <Table.Td>
                <Flex
                  mih={50}
                  gap="md"
                  justify="flex-start"
                  align="center"
                  direction="row"
                  wrap="wrap"
                >
                  <Avatar
                    variant="default"
                    color="gray"
                    size="lg"
                    radius="xl"
                    aria-label="Add user"
                    style={{ border: '1px dashed grey' }}
                  >
                    <IconUserPlus
                      color="grey"
                      style={{ width: '70%', height: '70%' }}
                      stroke={1.5}
                    />
                  </Avatar>
                  <Text c="grey">Add user</Text>
                </Flex>
              </Table.Td>
              <Table.Td />
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
      <Flex px="10" style={{ cursor: 'pointer' }} />
    </>
  );
});

export default GroupMembers;
