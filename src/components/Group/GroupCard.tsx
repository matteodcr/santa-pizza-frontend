import {
  Avatar,
  BackgroundImage,
  Badge,
  Box,
  Card,
  Flex,
  Group as GroupUI,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { observer } from 'mobx-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRootStore } from '@/stores/Root.store';
import AvatarBadge from '@/components/AvatarBadge';
import { GROUP } from '@/routes';
import { Group } from '@/stores/entity/Group';
import styles from './GroupCard.module.css';

export const GroupBadge = observer(({ status }: { status: string }) => {
  const theme = useMantineTheme();
  const groupStatus = (status: string) => {
    if (status === 'OPEN') {
      return theme.colors.green[6];
    }
    if (status === 'ASSOCIATED') {
      return theme.colors.pink[6];
    }
    return 'gray';
  };
  const store = useRootStore();
  return (
    <Flex
      mih={50}
      gap="md"
      justify="flex-end"
      align="flex-end"
      direction="column"
      wrap="wrap"
      h="100%"
    >
      <Box p="1em" style={{ borderRadius: '10px' }}>
        <Badge size="lg" color={groupStatus(status)}>
          {status}
        </Badge>
      </Box>
    </Flex>
  );
});

interface GroupCardProps {
  group: Group;
}

const GroupCard = observer(({ group }: GroupCardProps) => {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => navigate(`${GROUP}/${group.id}`)}
      shadow="sm"
      padding="lg"
      radius="lg"
      style={{ cursor: 'pointer' }}
      withBorder
      className={styles.card}
    >
      <Card.Section>
        {group.backgroundUrl ? (
          <BackgroundImage src={group.backgroundUrl!} h={200}>
            <GroupBadge status={group.status!} />
          </BackgroundImage>
        ) : (
          <Box h={200} p={0} bg="var(--mantine-color-blue-light)">
            <GroupBadge status={group.status!} />
          </Box>
        )}

        <Box p="md" pt={0}>
          <GroupUI justify="space-between" pt="xs" mb="xs">
            <Title lineClamp={1} order={3} fw={500}>
              {group.name}
            </Title>
          </GroupUI>

          <GroupUI justify="space-between">
            <Avatar.Group>
              {group.memberships.map((membership) => (
                <AvatarBadge key={membership.id} user={membership.user!} />
              ))}
            </Avatar.Group>
          </GroupUI>
        </Box>
      </Card.Section>
    </Card>
  );
});

export default GroupCard;
