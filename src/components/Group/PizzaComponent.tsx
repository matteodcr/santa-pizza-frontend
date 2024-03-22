import React from 'react';
import { Container, Divider, Flex, Group as GroupUI, Text, Title } from '@mantine/core';
import { observer } from 'mobx-react';
import { useRootStore } from '@/stores/Root.store';
import AvatarBadge from '@/components/AvatarBadge';
import { Group } from '@/stores/entity/Group';
import { Membership } from '@/stores/entity/Membership';

interface PizzaComponentProps {
  group: Group;
}

const PizzaComponent: React.FC<PizzaComponentProps> = observer(({ group }: PizzaComponentProps) => {
  const store = useRootStore();

  const demoProps = {
    w: '38vw',
    position: 'relative',
  };

  const currentUser = store.userStore.getCurrentUser();
  let santaMembership: Membership | undefined;
  if (currentUser) {
    santaMembership = store.groupStore.getUserMembership(group, currentUser!);
  }

  return (
    <>
      <Divider my="md" />
      {currentUser ? (
        <GroupUI justify="center" gap="sm" px={0} grow>
          {santaMembership ? (
            <Flex mih={50} gap="md" justify="center" align="center" direction="column" wrap="wrap">
              <AvatarBadge user={santaMembership.user!} avatarSize={100} />
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
              pb="1em"
              label={
                <Title pt="0.3em" mr="-0.35em" ml="-0.35em" size="8em">
                  🍕
                </Title>
              }
            />
          </Container>
          {santaMembership?.santaPizza?.receiverMembership ? (
            <Flex mih={50} gap="md" justify="center" align="center" direction="column" wrap="wrap">
              <AvatarBadge
                user={santaMembership.santaPizza.receiverMembership.user!}
                avatarSize={100}
              />
              <Title order={5}>Receiver</Title>
            </Flex>
          ) : (
            <Text>No receiver</Text>
          )}
        </GroupUI>
      ) : (
        <Text>Loading...</Text>
      )}
    </>
  );
});

export default PizzaComponent;
