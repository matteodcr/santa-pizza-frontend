import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { DatesProvider } from '@mantine/dates';
import { Router } from './Router';
import { theme } from '@/theme';

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <ModalsProvider>
        <DatesProvider settings={{ consistentWeeks: true }}>
          <Router />
        </DatesProvider>
      </ModalsProvider>
    </MantineProvider>
  );
}
