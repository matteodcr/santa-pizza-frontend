import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import {
  Anchor,
  Button,
  Checkbox,
  Container,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import classes from './Auth.module.css';
import { useRootStore } from '@/stores/Root.store';
import { DASHBOARD, SIGNUP } from '@/routes';

const Signin: React.FC = observer(() => {
  const navigate = useNavigate();
  const store = useRootStore();

  useEffect(() => {}, []);

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
      navigate(DASHBOARD);
    } catch (error) {
      notifications.show({
        message: undefined,
        title: 'Erreur de connexion',
      });
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center" className={classes.title}>
        Welcome back!
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Do not have an account yet?{' '}
        <Anchor size="sm" component="button" onClick={() => navigate(SIGNUP)}>
          Create account
        </Anchor>
      </Text>

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
