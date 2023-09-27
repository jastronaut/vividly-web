import { Center, Group, Button, Title, Space } from '@mantine/core';
import Link from 'next/link';

import { Page } from '../_app';
import { useCurUserContext } from '@/components/contexts/CurUserContext';
import { FadeIn } from '@/styles/Animations';
import AdminLayout from '@/components/layout/AdminLayout';
import { Loading } from '@/components/common/Loading';
import { useAccountInfoContext } from '@/components/contexts/AccountInfoContext';

export const AdminPage: Page = () => {
	const { curUser, isLoading } = useCurUserContext();
	const { accountInfo } = useAccountInfoContext();

	if (isLoading || !curUser || !curUser.user) {
		return <Loading />;
	}

	if (!accountInfo || !accountInfo.authUser.isAdmin) {
		return <Title order={3}>No.</Title>;
	}

	return (
		<FadeIn>
			<Center>
				<Title order={3}>Super secret admin page</Title>
			</Center>
			<Space h='lg' />
			<Center>
				<Group>
					<Link href='/admin/user-lookup'>
						<Button>Lookup User</Button>
					</Link>
					<Link href='/admin/manage-reports'>
						<Button>Manage Reports</Button>
					</Link>
				</Group>
			</Center>
		</FadeIn>
	);
};

AdminPage.getLayout = (page: React.ReactNode) => {
	return <AdminLayout>{page}</AdminLayout>;
};

export default AdminPage;
