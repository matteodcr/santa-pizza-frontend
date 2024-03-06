import { Anchor, Avatar, Group, HoverCard, Text } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { User } from '@/stores/Root.store';
import { USER } from '@/routes';

export default function AvatarBadge({ user }: { user: User }) {
  const navigate = useNavigate();
  const truncatedDescription = user.description
    ? user.description.length > 30
      ? `${user.description.substring(0, 30)}...`
      : user.description
    : '';
  return (
    <Group
      justify="center"
      onClick={(e) => {
        e.stopPropagation();
        navigate(`${USER}/${user.username}`);
      }}
      style={{ cursor: 'pointer' }}
    >
      <HoverCard width={320} shadow="md" withArrow openDelay={200} closeDelay={400}>
        <HoverCard.Target>
          <Avatar radius="xl" />
        </HoverCard.Target>
        <HoverCard.Dropdown>
          <Anchor style={{ flex: 1 }} onClick={() => navigate(`${USER}/${user.username}`)}>
            <Text fz="sm" fw={500}>
              {user.name}
            </Text>
            <Text fz="xs" c="dimmed">
              @{user.username}
            </Text>
          </Anchor>

          <Text size="sm" mt="md">
            {truncatedDescription}
          </Text>
        </HoverCard.Dropdown>
      </HoverCard>
    </Group>
  );
}
