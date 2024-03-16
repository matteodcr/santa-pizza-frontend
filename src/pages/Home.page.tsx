import { Button, Group } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { Welcome } from '@/components/Welcome/Welcome';
import { SIGNIN, SIGNUP } from '@/routes';

export function HomePage() {
  const navigate = useNavigate();
  return (
    <>
      <Welcome />
      <Group justify="center">
        <Button onClick={() => navigate(SIGNIN)}>Sign in</Button>
        <Button onClick={() => navigate(SIGNUP)}>Sign up</Button>
      </Group>
    </>
  );
}
