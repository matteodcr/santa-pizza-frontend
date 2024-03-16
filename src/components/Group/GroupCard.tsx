import {
  ActionIcon,
  Avatar,
  Badge,
  Card,
  Group as GroupUI,
  Image,
  Menu,
  rem,
  Title,
} from '@mantine/core';
import { observer } from 'mobx-react';
import React from 'react';
import { IconDots, IconTrash } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useRootStore } from '@/stores/Root.store';
import AvatarBadge from '@/components/AvatarBadge';
import { GROUP } from '@/routes';
import { Group } from '@/stores/entity/Group';

interface GroupCardProps {
  group: Group;
}

const GroupCard = observer(({ group }: GroupCardProps) => {
  const navigate = useNavigate();
  const store = useRootStore();

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: number) => {
    e.stopPropagation();
    await store.api.deleteGroup(id);
    store.groupStore.deleteGroup(id);
  };
  return (
    <Card
      onClick={() => navigate(`${GROUP}/${group.id}`)}
      shadow="sm"
      padding="lg"
      radius="md"
      style={{ cursor: 'pointer' }}
      withBorder
    >
      <Card.Section>
        <Image
          src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"
          height={160}
          alt="Norway"
        />
      </Card.Section>

      <GroupUI justify="space-between" mt="md" mb="xs">
        <Title lineClamp={1} order={3} fw={500}>
          {group.name}
        </Title>
        <Badge color="pink">{group.status}</Badge>
      </GroupUI>

      <GroupUI justify="space-between">
        <Avatar.Group>
          {group.memberships.map((membership) => (
            <AvatarBadge key={membership.id} user={membership.user} />
          ))}
        </Avatar.Group>
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <ActionIcon
              onClick={(e) => e.stopPropagation()}
              variant="default"
              size="lg"
              aria-label="Settings"
            >
              <IconDots
                style={{
                  width: '70%',
                  height: '70%',
                }}
                stroke={1.5}
              />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item
              color="red"
              onClick={(e) => handleDelete(e, group.id)}
              leftSection={
                <IconTrash
                  style={{
                    width: rem(14),
                    height: rem(14),
                  }}
                />
              }
            >
              Delete group
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </GroupUI>
    </Card>
  );
});

export default GroupCard;
