import { ActionIcon, Anchor, Badge, Button, Flex, Table, Text } from '@mantine/core';
import { IconArrowUp, IconPlus, IconTrash } from '@tabler/icons-react';
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
          <AvatarBadge user={membership.user} />
          <Anchor onClick={() => navigate(`${USER}/${membership.user.username}`)}>
            <Text fz="sm" fw={500}>
              {membership.user.name}
            </Text>
            <Text fz="xs" c="dimmed">
              @{membership.user.username}
            </Text>
          </Anchor>
          {membership.role === 'ADMIN' ? (
            <Badge
              size="lg"
              variant="gradient"
              gradient={{ from: 'orange', to: 'yellow', deg: 90 }}
            >
              Admin
            </Badge>
          ) : (
            <div />
          )}
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

            <ActionIcon
              variant="light"
              color="red"
              size="xl"
              onClick={() => handleRemoveUser(membership.user.username)}
            >
              <IconTrash size={14} />
            </ActionIcon>
          </Flex>
        ) : (
          <div />
        )}
      </Table.Td>
    </Table.Tr>
  ));
  return (
    <>
      <Table.ScrollContainer minWidth={100}>
        <Table verticalSpacing="sm" withRowBorders={false}>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Table.ScrollContainer>
      <Button variant="light" onClick={open} leftSection={<IconPlus size={14} />}>
        Add user
      </Button>
    </>
  );
};

export default GroupMembers;
