import { NotificationData, notifications } from '@mantine/notifications';
import { IconBug, IconCheck, IconX } from '@tabler/icons-react';

const commonFields = {
  radius: 'lg',
  withBorder: true,
};
export async function showErrorNotification(error: any, errorMessage: string) {
  let notificationContent: {} = {};
  if (error instanceof Response) {
    const responseData = await error.json(); // Convert response to JSON
    errorMessage += `: ${responseData.message}`;
    notificationContent = {
      title: (error as Response).statusText,
      message: errorMessage,
      color: 'red',
      icon: <IconX />,
    };
  } else {
    notificationContent = {
      title: 'Error',
      message: errorMessage,
      color: 'yellow',
      icon: <IconBug />,
    };
  }
  notifications.show({ ...commonFields, ...(notificationContent as NotificationData) });
}

export async function showSuccessNotification(successTitle: string) {
  notifications.show({
    title: successTitle,
    message: undefined,
    color: 'teal',
    icon: <IconCheck />,
    ...commonFields,
  });
}
