import { ActionIcon } from '@mantine/core';
import { IconFeather } from '@tabler/icons-react';
import styled from 'styled-components';
import { rem } from 'polished';

const Container = styled.div<{ isVisible: boolean }>`
	position: fixed;
	bottom: ${rem(16)};
	right: ${rem(16)};
	visibility: ${props => (props.isVisible ? 'hidden' : 'visible')};
	z-index: 99;

	@media screen and (max-width: 800px) {
		bottom: ${rem(70)};
	}
`;

type Props = {
	isVisible: boolean;
	toggle: () => void;
};

export const NewPostButton = (props: Props) => {
	return (
		<Container isVisible={props.isVisible}>
			<ActionIcon
				variant='filled'
				radius='xl'
				color='grape'
				size='lg'
				onClick={props.toggle}
			>
				<IconFeather size='1.25rem' />
			</ActionIcon>
		</Container>
	);
};
