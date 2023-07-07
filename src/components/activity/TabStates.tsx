import { Container, Text, Skeleton } from '@mantine/core';

export const EmptyTab = () => {
	return (
		<Container py={36} px={0}>
			<Text align='center'>{`You're all caught up.`}</Text>
		</Container>
	);
};

export const LoadingTab = () => (
	<Container py={36} px={0}>
		<Skeleton height={8} mt={6} w='70%' radius='xl' />
		<Skeleton height={8} mt={6} w='70%' radius='xl' />
		<Skeleton height={8} mt={6} w='40%' radius='xl' />
	</Container>
);
