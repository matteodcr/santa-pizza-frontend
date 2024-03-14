import { ActionIcon, Anchor, Avatar, Flex, Table, Text, Title } from '@mantine/core';
import { IconArrowUp, IconTrash, IconUserPlus } from '@tabler/icons-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AvatarBadge from '@/components/AvatarBadge';
import { USER } from '@/routes';
import { useRootStore } from '@/stores/Root.store';

interface GroupMembersProps {
  indexStoredGroup: number;
  handleUpdateMember: (role: string, usernameToUpdate: string, groupId: number) => void;
  handleRemoveUser: (username: string) => void;
  open: () => void;
}

const GroupMembers = ({
  indexStoredGroup,
  handleUpdateMember,
  handleRemoveUser,
  open,
}: GroupMembersProps) => {
  const navigate = useNavigate();
  const store = useRootStore();

  const rows = store.groups[indexStoredGroup].memberships.map((membership) => (
    <Table.Tr key={membership.id}>
      <Table.Td>
        <Flex mih={50} gap="md" justify="flex-start" align="center" direction="row" wrap="wrap">
          <AvatarBadge user={membership.user} admin={membership.role === 'ADMIN'} />
          <Anchor onClick={() => navigate(`${USER}/${membership.user.username}`)}>
            <Text fz="sm" fw={500}>
              {membership.user.name}
            </Text>
            <Text fz="xs" c="dimmed">
              @{membership.user.username}
            </Text>
          </Anchor>
        </Flex>
      </Table.Td>

      <Table.Td>
        {store.isRemovable(membership.user.username, indexStoredGroup) ? (
          <Flex mih={50} gap="md" justify="flex-end" align="center" direction="row" wrap="wrap">
            {membership.role === 'USER' ? (
              <ActionIcon
                variant="light"
                color="blue"
                size="xl"
                onClick={() =>
                  handleUpdateMember(
                    'ADMIN',
                    membership.user.username,
                    store.groups[indexStoredGroup].id
                  )
                }
              >
                <IconArrowUp size={14} />
              </ActionIcon>
            ) : (
              <> </>
            )}
            {store.groups[indexStoredGroup].status === 'OPEN' ? (
              <ActionIcon
                variant="light"
                color="red"
                size="xl"
                onClick={() => handleRemoveUser(membership.user.username)}
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
      <Flex px="10" onClick={open} style={{ cursor: 'pointer' }} />
    </>
  );
};

export default GroupMembers;
