import AppShellLayout from '@/components/layout/AppShellLayout';
import { Page } from '@/pages/_app';
import {
	useCurUserContext,
	CurUserProvider,
} from '@/components/utils/CurUserContext';
const FeedbackPage = () => {
	const { curUser } = useCurUserContext();
	return (
		<AppShellLayout id={curUser.user?.id}>
			<iframe
				src='https://docs.google.com/forms/d/e/1FAIpQLSe9v9L50mQugy0TmothI-Xtz-XCy0Fl3jCEp_aOPvWZmYRj0A/viewform?embedded=true'
				width='640'
				height='716'
				frameBorder='0'
				marginHeight={0}
				marginWidth={0}
			>
				Loading…
			</iframe>
		</AppShellLayout>
	);
};

FeedbackPage.getLayout = (page: React.ReactNode) => {
	return <CurUserProvider>{page}</CurUserProvider>;
};

export default FeedbackPage;
