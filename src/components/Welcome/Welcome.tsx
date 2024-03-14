import { Group, Text, Title } from '@mantine/core';
import classes from './Welcome.module.css';

export function Welcome() {
  return (
    <>
      <Title className={classes.title} ta="center" mt={100}>
        Welcome to{' '}
        <Text inherit variant="gradient" component="span" gradient={{ from: 'red', to: 'green' }}>
          Pizza Party
        </Text>
      </Title>
      <Text c="dimmed" ta="center" size="lg" maw={580} mx="auto" mt="xl">
        This is like a secret santa but with pizzas. Join us and get a chance to send and receive
      </Text>
      <Group />
    </>
  );
}
