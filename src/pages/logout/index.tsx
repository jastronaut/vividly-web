import { Button, Center } from '@mantine/core';
import { STORAGE_CUR_USER_KEY } from '@/constants';

import GradientLayout from '@/components/layout/GradientLayout';
import { Page } from '../_app';
import { withAuth } from '@/components/hooks/withAuth';

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
	return <GradientLayout>{page}</GradientLayout>;
};

export default withAuth(Logout);
