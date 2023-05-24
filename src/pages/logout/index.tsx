import { Button, Center, Container } from '@mantine/core';
import { STORAGE_CUR_USER_KEY } from '@/constants';

export default function Feed() {
	return (
		<>
			<Center sx={{ height: '100vh' }}>
				<Container>
					<Button
						onClick={() => {
							localStorage.removeItem(STORAGE_CUR_USER_KEY);
							window.location.href = '/login';
						}}
					>
						Logout
					</Button>
				</Container>
			</Center>
		</>
	);
}
