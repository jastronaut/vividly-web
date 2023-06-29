import AppLayout from '@/components/layout/AppLayout';

const FeedbackPage = () => {
	return (
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
	);
};

FeedbackPage.getLayout = (page: React.ReactNode) => {
	return <AppLayout>{page}</AppLayout>;
};

export default FeedbackPage;
