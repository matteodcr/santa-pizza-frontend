import React from 'react';
import { observer } from 'mobx-react';
import {
  Anchor,
  Button,
  Checkbox,
  Container,
  Group,
  Paper,
  PasswordInput,
  TextInput,
  Title,
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useForm } from '@mantine/form';
import classes from './Auth.module.css';
import { useRootStore } from '@/stores/Root.store';
import { GROUPS } from '@/routes';
import { showErrorNotification, showSuccessNotification } from '@/utils/notification';

const Signin: React.FC = observer(() => {
  const navigate = useNavigate();
  const store = useRootStore();

  const form = useForm({
    initialValues: {
      username: '',
      password: '',
    },
    validate: {
      username: (value: string) => {
        if (!value) {
          return 'Username is required';
        }
        return undefined;
      },
      password: (value: string) => {
        if (!value) {
          return 'Password is required';
        }
        return undefined;
      },
    },
  });

  const handleSignIn = async () => {
    try {
      localStorage.removeItem('accessToken');
      await store.api.signin(form.values);
      console.log('token:', localStorage.getItem('accessToken'));
      await store.loadCurrentUser();
      await showSuccessNotification('Signed in successfully');
      navigate(GROUPS);
    } catch (e) {
      await showErrorNotification(e, 'Failed to sign in');
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center" className={classes.title}>
        Hello!
      </Title>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit((values) => console.log(values))}>
          <TextInput
            label="Username or Mail"
            placeholder="Enter your username or mail"
            {...form.getInputProps('username')}
          />
          <PasswordInput
            label="Password"
            placeholder="Enter your password"
            {...form.getInputProps('password')}
          />
          <Group justify="space-between" mt="lg">
            <Checkbox label="Remember me" />
            <Anchor component="button" size="sm">
              Forgot password?
            </Anchor>
          </Group>
          <Button fullWidth mt="xl" onClick={handleSignIn}>
            Sign In
          </Button>
        </form>
      </Paper>
    </Container>
  );
});

export default Signin;
