import React from 'react';
import { ActionIcon, Container, Divider, Flex, Group, Text, Title } from '@mantine/core';
import { observer } from 'mobx-react';
import { IconPizza } from '@tabler/icons-react';
import { useRootStore } from '@/stores/Root.store';
import AvatarBadge from '@/components/AvatarBadge';

interface PizzaComponentProps {
  indexStoredGroup: number;
}

const PizzaComponent: React.FC<PizzaComponentProps> = observer(({ indexStoredGroup }) => {
  const store = useRootStore();

  const demoProps = {
    w: '38vw',
    position: 'relative',
  };

  const santaMembership = store.getUserMembership(indexStoredGroup);
  console.log(santaMembership);
  return (
    <>
      {store.currentUser ? (
        <Group justify="center" gap="sm" px={0} grow>
          {santaMembership ? (
            <Flex mih={50} gap="md" justify="center" align="center" direction="column" wrap="wrap">
              <AvatarBadge user={santaMembership.user} avatarSize={100} />
              <Title order={5}>Santa (You)</Title>
            </Flex>
          ) : (
            <Text>No Santa</Text>
          )}
          <Container px={0} fluid size="30rem" {...demoProps}>
            <Divider
              size={3}
              color="grey"
              mx={-10}
              label={
                <ActionIcon variant="light" color="red" size="xl" aria-label="Settings">
                  <IconPizza style={{ width: '70%', height: '70%' }} stroke={1.5} />
                </ActionIcon>
              }
            />
          </Container>
          {santaMembership ? (
            <Flex mih={50} gap="md" justify="center" align="center" direction="column" wrap="wrap">
              <AvatarBadge
                user={santaMembership.santaPizza.receiverMembership.user}
                avatarSize={100}
              />
              <Title order={5}>Receiver</Title>
            </Flex>
          ) : (
            <Text>No Santa</Text>
          )}
        </Group>
      ) : (
        <Text>Loading...</Text>
      )}
    </>
  );
});

export default PizzaComponent;
