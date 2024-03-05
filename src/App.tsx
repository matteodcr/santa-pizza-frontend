import '@mantine/core/styles.css';
import { Notifications } from '@mantine/notifications';
import { MantineProvider } from '@mantine/core';
import { Router } from './Router';
import { theme } from './theme';

export default function App() {
    return (
        <MantineProvider theme={theme}>
                <Router />
                    <Notifications
                      position="top-right"
                    />

        </MantineProvider>
);
}
