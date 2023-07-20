import styled from 'styled-components';
import { Text } from '@mantine/core';
import Link from 'next/link';
import { rem } from 'polished';

const Wrapper = styled.div`
	border-top: 1px solid ${props => props.theme.background.secondary};
	height: ${rem(50)};
	display: flex;
	flex-direction: column;
	justify-content: center;
`;

export const NextFeedSection = () => {
	return (
		<Wrapper>
			<Text ta='center' color='dimmed'>
				Next up: <Link href='/profile/1'>Your Feed</Link>
			</Text>
		</Wrapper>
	);
};
