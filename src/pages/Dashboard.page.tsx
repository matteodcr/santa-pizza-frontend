import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, SimpleGrid, Text } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { runInAction } from 'mobx';
import { IconPlus } from '@tabler/icons-react';
import { useRootStore } from '@/stores/Root.store';
import { GROUP } from '@/routes';
import GroupCard from '@/components/GroupCard';

const DashboardPage: React.FC = observer(() => {
  const store = useRootStore();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const groups = await store.api.fetchGroups();
      runInAction(() => {
        store.groups = groups;
      });
    }
    fetchData();
  }, [store.api]);

  return (
    <>
      <Button
        onClick={() => navigate(`${GROUP}/create`)}
        mt="md"
        leftSection={<IconPlus size={14} />}
      >
        New group
      </Button>

      {store.groups ? (
        <SimpleGrid cols={2} py="1em">
          {store.groups.map((group) => (group ? <GroupCard key={group.id} group={group} /> : null))}
        </SimpleGrid>
      ) : (
        <Text>No groups</Text>
      )}
    </>
  );
});

export default DashboardPage;
