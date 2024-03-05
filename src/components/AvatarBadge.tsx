import { Avatar, Group, HoverCard, Stack, Text } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { User } from '@/stores/Root.store';
import { USER } from '@/routes';

export default function AvatarBadge({ user }: { user: User }) {
  const navigate = useNavigate();
  const truncatedDescription = user.description
    ? user.description.length > 10
      ? `${user.description.substring(0, 10)}...`
      : user.description
    : '';
  return (
    <Group justify="center">
      <HoverCard width={320} shadow="md" withArrow openDelay={200} closeDelay={400}>
        <HoverCard.Target>
          <Avatar radius="xl" onClick={() => navigate(`${USER}/${user.username}`)} />
        </HoverCard.Target>
        <HoverCard.Dropdown>
          <Group>
            <Avatar radius="xl" />
            <Stack gap={5}>
              <Text size="sm" fw={700} style={{ lineHeight: 1 }}>
                {user.name}
              </Text>
              @{user.username}
            </Stack>
          </Group>

          <Text size="sm" mt="md">
            {truncatedDescription}
          </Text>

          <Group mt="md" gap="xl" />
        </HoverCard.Dropdown>
      </HoverCard>
    </Group>
  );
}
