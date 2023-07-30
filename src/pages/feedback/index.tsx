import { useEffect, useState } from 'react';

import { Loading } from '@/components/utils/Loading';
import AppLayout from '@/components/layout/AppLayout';
import { withAuth } from '@/components/withAuth';

const FeedbackPage = () => {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);
	return (
		<div style={{ minHeight: '100vh' }}>
			{!mounted ? (
				<Loading />
			) : (
				<iframe
					src='https://docs.google.com/forms/d/e/1FAIpQLSe9v9L50mQugy0TmothI-Xtz-XCy0Fl3jCEp_aOPvWZmYRj0A/viewform?embedded=true'
					width='100%'
					style={{
						minHeight: '90vh',
					}}
				>
					Loading…
				</iframe>
			)}
		</div>
	);
};

FeedbackPage.getLayout = (page: React.ReactNode) => {
	return <AppLayout>{page}</AppLayout>;
};

export default withAuth(FeedbackPage);
