import { useEffect, useState } from 'react';

import { Loading } from '@/components/common/Loading';
import AppLayout from '@/components/layout/AppLayout';

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
					src='https://docs.google.com/forms/d/e/1FAIpQLSfYvNRFvp5MG714jY3C2nBD8ODrliMESVgp5dQsblqWyxXnEQ/viewform?embedded=true'
					width='100%'
					style={{
						minHeight: '90vh',
						border: 'none',
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

export default FeedbackPage;
