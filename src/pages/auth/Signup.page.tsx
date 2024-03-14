import React from 'react';
import { observer } from 'mobx-react';
import { Button, Container, Paper, PasswordInput, TextInput, Title } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useForm } from '@mantine/form';
import classes from './Auth.module.css';
import { useRootStore } from '@/stores/Root.store';
import { SIGNIN } from '@/routes';

const Signup: React.FC = observer(() => {
  const store = useRootStore();
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      username: '',
      mail: '',
      password: '',
    },
    validate: {
      username: (value: string) => {
        if (!value) {
          return 'Username is required';
        }
        return undefined;
      },
      mail: (value: string) => {
        if (!value) {
          return 'Mail is required';
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

  const handleSignUp = async () => {
    try {
      await store.api.signup(form.values);
      navigate(SIGNIN);
      // Handle success
    } catch (error) {
      // Handle error
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center" className={classes.title}>
        Welcome!
      </Title>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <TextInput
          label="Username"
          placeholder="Enter your username"
          {...form.getInputProps('username')}
        />
        <TextInput label="Mail" placeholder="Enter your mail" {...form.getInputProps('mail')} />
        <PasswordInput
          label="Password"
          placeholder="Enter your password"
          {...form.getInputProps('password')}
        />
        <Button fullWidth mt="xl" onClick={handleSignUp}>
          Sign Up
        </Button>
      </Paper>
    </Container>
  );
});

export default Signup;
