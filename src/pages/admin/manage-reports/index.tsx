import { Title } from '@mantine/core';

import { Page } from '../../_app';
import { useCurUserContext } from '@/components/contexts/CurUserContext';
import { PostDrawer } from '@/components/profile/PostDrawer/PostDrawer';
import { PostDrawerProvider } from '@/components/contexts/PostDrawerContext';
import { FadeIn } from '@/styles/Animations';
import { ManageReports } from '@/components/admin/ManageReports';
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
			<PostDrawerProvider>
				<ManageReports />
				<PostDrawer onClickQuotePost={() => {}} deletePost={() => {}} />
			</PostDrawerProvider>
		</FadeIn>
	);
};

AdminPage.getLayout = (page: React.ReactNode) => {
	return <AdminLayout>{page}</AdminLayout>;
};

export default AdminPage;
