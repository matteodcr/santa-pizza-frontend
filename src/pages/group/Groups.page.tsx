import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, SimpleGrid, Text } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { IconPlus } from '@tabler/icons-react';
import { useRootStore } from '@/stores/Root.store';
import { GROUP } from '@/routes';
import GroupCard from '@/components/Group/GroupCard';
import { showErrorNotification } from '@/utils/notification';

const GroupsPage: React.FC = observer(() => {
  const store = useRootStore();
  const navigate = useNavigate();

  const { groups } = store.groupStore;

  useEffect(() => {
    async function fetchData() {
      try {
        const updatedGroups = await store.api.fetchGroups();
        store.groupStore.updateGroups(updatedGroups);
      } catch (e) {
        await showErrorNotification(e, 'Failed to fetch groups');
      }
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

      {groups ? (
        <SimpleGrid cols={2} py="1em">
          {groups.map((group) => (group ? <GroupCard key={group.id} group={group} /> : null))}
        </SimpleGrid>
      ) : (
        <Text>No groups</Text>
      )}
    </>
  );
});

export default GroupsPage;
