import { Affix, ActionIcon } from '@mantine/core';
import { IconFeather } from '@tabler/icons-react';

type Props = {
	isOpen: boolean;
	toggle: () => void;
};

export const NewPostButton = (props: Props) => {
	return (
		<Affix
			position={{
				bottom: '1rem',
				right: '1rem',
			}}
			style={{
				visibility: props.isOpen ? 'hidden' : 'visible',
			}}
		>
			<ActionIcon
				variant='filled'
				radius='xl'
				color='grape'
				size='lg'
				onClick={props.toggle}
			>
				<IconFeather size='1.25rem' />
			</ActionIcon>
		</Affix>
	);
};
