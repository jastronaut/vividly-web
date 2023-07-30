import { Button, Center } from '@mantine/core';
import { STORAGE_CUR_USER_KEY } from '@/constants';

import LoginLogoutLayout from '@/components/layout/LoginLogoutLayout';
import { Page } from '../_app';
import { withAuth } from '@/components/withAuth';

const Logout: Page = () => {
	return (
		<Center
			sx={{
				height: '100vh',
			}}
		>
			<Button
				variant='white'
				onClick={() => {
					localStorage.removeItem(STORAGE_CUR_USER_KEY);
					window.location.href = '/login';
				}}
			>
				Logout
			</Button>
		</Center>
	);
};

Logout.getLayout = page => {
	return <LoginLogoutLayout>{page}</LoginLogoutLayout>;
};

export default withAuth(Logout);
