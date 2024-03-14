import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { Alert, Divider, Text, Title } from '@mantine/core';
import { useNavigate, useParams } from 'react-router-dom';
import { IconInfoCircle } from '@tabler/icons-react';
import { useRootStore } from '@/stores/Root.store';
import AvatarBadge from '@/components/AvatarBadge';

const PizzaPage: React.FC = observer(() => {
  const store = useRootStore();
  const navigate = useNavigate();
  const { id } = useParams();
  const pizza = store.pizzaById(Number(id));

  useEffect(() => {
    async function fetchData() {
      store.updatePizza([await store.api.fetchPizza(Number(id))]);
      console.log(pizza?.santaMembership.user);
      console.log(store.currentUser);
    }
    fetchData();
  }, [store.api]);

  return pizza ? (
    <>
      {pizza.receiverMembership ? (
        <>
          <Title order={3}>Your pizza for {pizza.receiverMembership.user.username}</Title>
          <AvatarBadge user={pizza.receiverMembership.user} />
          <Divider />
          <Text> {pizza?.status}</Text>
          <Text> {pizza?.description}</Text>
          <Text> {pizza?.id}</Text>
        </>
      ) : (
        <Alert
          variant="filled"
          color="yellow"
          title="You are not the Santa for this pizza"
          icon={<IconInfoCircle />}
        />
      )}
    </>
  ) : (
    <Text>Loading...</Text>
  );
});

export default PizzaPage;
