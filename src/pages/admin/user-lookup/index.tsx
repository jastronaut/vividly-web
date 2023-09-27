import { Page } from '../../_app';
import { useCurUserContext } from '@/components/contexts/CurUserContext';

import { FadeIn } from '@/styles/Animations';
import { UserLookup } from '@/components/admin/UserLookup';
import AdminLayout from '@/components/layout/AdminLayout';
import { Loading } from '@/components/common/Loading';

export const AdminPage: Page = () => {
	const { curUser, isLoading } = useCurUserContext();

	if (isLoading || !curUser || !curUser.user) {
		return <Loading />;
	}

	return (
		<FadeIn>
			<UserLookup />
		</FadeIn>
	);
};

AdminPage.getLayout = (page: React.ReactNode) => {
	return <AdminLayout>{page}</AdminLayout>;
};

export default AdminPage;
