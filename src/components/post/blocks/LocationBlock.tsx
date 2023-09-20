import styled from 'styled-components';
import Image from 'next/image';
import { rem } from 'polished';
import { Text } from '@mantine/core';

import { LocationBlock as LocationBlockType } from '@/types/post';

export const LocationOptionContainer = styled.div<{ inSelector: boolean }>`
	border-radius: ${rem(4)};
	${props =>
		props.inSelector
			? `border: 1px solid ${props.theme.border.secondary}`
			: ''};

	padding: ${rem(4)} ${rem(8)};
	margin: 0 ${rem(8)};
	display: grid;
	grid-template-columns: ${rem(24)} 1fr;

	:hover,
	:active {
		${props =>
			props.inSelector
				? `
					transition: all 0.2s ease-in-out;
					background-color: ${props.theme.accent}30;
					border: 1px solid ${props.theme.accent};
			 		cursor: pointer;`
				: ''}
	}

	> img {
		width: ${rem(24)};
		height: ${rem(24)};
	}

	.mantine-Text-root {
		margin-left: ${rem(8)};
		line-height: ${rem(16)};
	}
`;

type Props = {
	inSelector?: boolean;
	onClick?: () => void;
} & LocationBlockType;

export const LocationBlock = (props: Props) => {
	const { inSelector = false, onClick = () => {} } = props;
	return (
		<LocationOptionContainer inSelector={inSelector} onClick={onClick}>
			<Image src={props.icon} alt={props.name} width={24} height={24} />
			<div>
				<Text>{props.name}</Text>
				<Text c='dimmed' size='xs'>
					{props.locality}, {props.region}
				</Text>
			</div>
		</LocationOptionContainer>
	);
};
