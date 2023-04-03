import { notifications } from '@mantine/notifications';
import { IconX } from '@tabler/icons-react';

export function showAndLogErrorNotification(message: string, error: any) {
	console.error('🟣 Vividly Error: ', error);
	notifications.show({
		title: 'Error',
		message,
		color: 'red',
		icon: <IconX />,
		autoClose: 5000,
	});
}
