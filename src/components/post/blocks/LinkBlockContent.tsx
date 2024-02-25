import styled from 'styled-components';
import { rem } from 'polished';
import { IconLink } from '@tabler/icons-react';
import { Text } from '@mantine/core';

export const Image = styled.img`
	max-width: 50%;
	display: block;
	margin-bottom: ${rem(16)};
	background-color: ${props => props.theme.background.primary};

	@media screen and (max-width: ${rem(1000)}) {
		max-width: 100%;
	}
`;

export const LinkText = styled.span`
	text-decoration: none;
	a {
		display: flex;
		align-items: center;
	}

	a,
	a:visited,
	a:hover {
		color: ${props => props.theme.accent};
		text-decoration: none;
	}

	> a:first-child {
		height: 1rem;
	}
`;

const LinkInfo = styled.span`
	display: block;
	margin: 0 0;
	padding: 0 0;
	padding-top: ${rem(8)};
	padding-left: ${rem(16)};
	padding-bottom: ${rem(8)};
	margin-left: ${rem(4)};
	border-left: ${rem(4)} solid ${props => props.theme.border.secondary};

	> img {
		margin-top: ${rem(8)};
	}

	@media screen and (max-width: 800px) {
		padding-left: ${rem(8)};
		border-left-width: ${rem(2)};
	}
`;

type LinkBlockProps = {
	description?: string;
	imageURL?: string;
	title?: string;
	url: string;
	hideTopUrl?: boolean;
};

export const LinkBlockContent = (props: LinkBlockProps) => {
	return (
		<>
			<LinkText>
				<Text
					fw={700}
					sx={{
						width: 'fit-content',
					}}
				>
					<a href={props.url}>
						<IconLink size={18} /> {props.title ? props.title : props.url}
					</a>
				</Text>
				<LinkInfo>
					{props.imageURL && (
						<Image
							src={props.imageURL}
							alt={`Thumbnail`}
							height={25}
							width={25}
						/>
					)}
					<Text fs='italic'>
						{props.description ? props.description : props.url}
					</Text>
				</LinkInfo>
			</LinkText>
		</>
	);
};
