import { Text, Timeline } from '@mantine/core';
import { IconConfetti, IconPizza, IconPlayerPlay } from '@tabler/icons-react';
import React from 'react';
import { observer } from 'mobx-react';
import { getDayDifference } from '@/utils/date';
import { Group } from '@/stores/entity/Group';

interface GroupTimelineProps {
  group: Group;
}

const GroupTimeline = observer(({ group }: GroupTimelineProps) => (
  <Timeline
    active={group.status === 'OPEN' ? 0 : group.status === 'ASSOCIATED' ? 1 : 2}
    bulletSize="2em"
    lineWidth={2}
    py="md"
  >
    <Timeline.Item bullet={<IconPlayerPlay size={12} />} title="Group creation">
      <Text size="xs" mt={4}>
        {getDayDifference(new Date(group.createdAt!), new Date())}
      </Text>
    </Timeline.Item>

    <Timeline.Item bullet={<IconPizza size={12} />} title="Association">
      <Text size="xs" mt={4}>
        Manually lauch
      </Text>
    </Timeline.Item>

    <Timeline.Item title="Distribution" bullet={<IconConfetti size={12} />}>
      <Text size="xs" mt={4}>
        {getDayDifference(new Date(group.dueDate!), new Date())}
      </Text>
    </Timeline.Item>
  </Timeline>
));

export default GroupTimeline;
