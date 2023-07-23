import { Title, Flex, useMantineTheme, Tooltip } from '@mantine/core';
import { rem } from 'polished';
import styled from 'styled-components';

import { COLORS } from '@/styles/Theme';

import { useVividlyTheme } from '@/styles/Theme';

const Dot = styled.div<{ color: string; picked: boolean }>`
	width: ${rem(25)};
	height: ${rem(25)};
	border-radius: 50%;
	background-color: ${props => props.color};
	margin: ${rem(5)};
	border: ${props =>
		props.picked
			? `${rem(2)} solid ${props.theme.background.primary}`
			: 'none'};
	box-shadow: ${props =>
		props.picked ? `0 0 ${rem(8)} ${props.color}` : 'none'};
	transition: box-shadow 0.2s ease-in-out;
	:hover {
		cursor: pointer;
		box-shadow: ${props => `0 0 ${rem(12)} ${props.color}`};
	}
`;

const ColorOption = ({
	color,
	picked,
	onClick,
	name,
}: {
	color: string;
	picked: boolean;
	onClick: () => void;
	name: string;
}) => {
	return (
		<div onClick={onClick}>
			<Tooltip label={name} withArrow position='bottom'>
				<Dot color={color} picked={picked} />
			</Tooltip>
		</div>
	);
};

export const ColorSetting = () => {
	const theme = useMantineTheme();

	const {
		theme: vividlyTheme,
		accentColor,
		setAccentColor,
	} = useVividlyTheme();

	const isDarkMode = vividlyTheme === 'dark';

	const index = isDarkMode ? 8 : 6;

	const onClickColor = (color: string) => {
		setAccentColor(color);
	};

	return (
		<>
			<Title order={5}>Accent color</Title>
			<Flex wrap='wrap'>
				{COLORS.map(c => (
					<ColorOption
						key={c}
						color={theme.colors[c][index]}
						name={c}
						picked={c === accentColor}
						onClick={() => onClickColor(c)}
					/>
				))}
			</Flex>
		</>
	);
};
