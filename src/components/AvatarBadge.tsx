import {
  Anchor,
  Avatar,
  Group,
  HoverCard,
  Indicator,
  Text,
  Title,
  Tooltip,
  useMantineTheme,
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { User, useRootStore } from '@/stores/Root.store';
import { USER } from '@/routes';
import getInitials from '@/utils/initials';

interface AvatarBadgeProps {
  user: User;
  avatarSize?: number;
  admin?: boolean;
}

export default function AvatarBadge({ user, avatarSize, admin }: AvatarBadgeProps) {
  const navigate = useNavigate();
  const store = useRootStore();
  const truncatedDescription = user.description
    ? user.description.length > 30
      ? `${user.description.substring(0, 30)}...`
      : user.description
    : '';
  const theme = useMantineTheme();
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
          <Indicator
            style={{ zIndex: 0 }}
            color="transparent"
            position="top-center"
            label={
              <Tooltip label="👑 Admin 👑">
                <Title order={3}>👑</Title>
              </Tooltip>
            }
            disabled={!admin}
          >
            <Avatar
              size={avatarSize || 'lg'}
              src={user?.avatarUrl}
              style={admin ? { border: `2px solid ${theme.colors.orange[4]}` } : {}}
            >
              {getInitials(user.name)}
            </Avatar>
          </Indicator>
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
