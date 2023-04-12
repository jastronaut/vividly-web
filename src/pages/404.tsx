import { Center, Text, Title, Button, Space } from '@mantine/core';
import styled from 'styled-components';
import { IconArrowLeft } from '@tabler/icons-react';
import { useRouter } from 'next/router';

import { Page } from './_app';

const Wrapper = styled.div`
	background: ${props => props.theme.background.primary};
	color: ${props => props.theme.text.primary};
	text-align: center;
`;

const PageNotFound: Page<{}> = () => {
	const router = useRouter();
	return (
		<Center sx={{ height: '100vh' }}>
			<Wrapper>
				<Title
					variant='gradient'
					gradient={{ from: 'grape', to: 'violet', deg: 45 }}
				>
					404
				</Title>
				<Text
					variant='gradient'
					gradient={{ from: 'grape', to: 'violet', deg: 45 }}
					fw={700}
				>
					Page Not Found :(
				</Text>
				<Space h='lg' />
				<Button
					variant='gradient'
					gradient={{ from: 'grape', to: 'violet', deg: 45 }}
					component='a'
					leftIcon={<IconArrowLeft />}
					onClick={() => {
						router.back();
					}}
				>
					Go Back
				</Button>
			</Wrapper>
		</Center>
	);
};

export default PageNotFound;
