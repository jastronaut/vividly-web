import { Center, Text, Title, Button, Space } from '@mantine/core';
import styled from 'styled-components';
import { IconArrowLeft } from '@tabler/icons-react';

import { Page } from './_app';
import Link from 'next/link';

const Wrapper = styled.div`
	color: ${props => props.theme.text.primary};
	background-color: ${props => props.theme.background.secondary};
	text-align: center;
`;

const PageNotFound: Page<{}> = () => {
	return (
		<Wrapper>
			<Center sx={{ height: '100vh' }}>
				<div>
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
					<Link href='/feed'>
						<Button
							variant='gradient'
							gradient={{ from: 'grape', to: 'violet', deg: 45 }}
							component='span'
							leftIcon={<IconArrowLeft />}
						>
							Go to feed
						</Button>
					</Link>
				</div>
			</Center>
		</Wrapper>
	);
};

export default PageNotFound;
