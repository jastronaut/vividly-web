import styled from 'styled-components';
import { rem } from 'polished';
import { IconLink } from '@tabler/icons-react';

import { LinkElement } from '../../../types/editor';

export const Image = styled.img`
	max-width: 50%;
	display: block;
	margin-bottom: ${rem(16)};
	background-color: ${props => props.theme.background.primary};

	@media screen and (max-width: ${rem(1000)}) {
		max-width: 100%;
	}
`;

export const LinkText = styled.p`
	text-decoration: none;
	a,
	a:visited,
	a:hover {
		color: ${props => props.theme.link};
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
	border-left: ${rem(4)} solid #cacaca;

	> img {
		margin-top: ${rem(8)};
	}
`;

type LinkBlockProps = {
	description?: string;
	imageURL?: string;
	title?: string;
	url: string;
};

export const LinkBlockContent = (props: LinkBlockProps) => {
	return (
		<LinkText>
			<a href={props.url}>
				<IconLink size={18} /> {props.title ?? props.url}
			</a>
			<LinkInfo>
				<i>{props.description ?? props.url}</i>
				{props.imageURL && <Image src={props.imageURL} alt={`Thumbnail`} />}
			</LinkInfo>
		</LinkText>
	);
};
