import styled from 'styled-components';
import { rem } from 'polished';
import { Avatar } from '@mantine/core';

import { DEFAULT_AVATAR } from '../../constants';

const Wrapper = styled.div`
	display: flex;
	padding: ${rem(16)} ${rem(24)};
	border: 1px solid ${props => props.theme.background.primary};
	background: ${props => props.theme.background.primary};
	color: ${props => props.theme.text.primary};
	cursor: pointer;
	margin: ${rem(8)} 0;
	border-radius: ${rem(8)};
	:hover {
		background: ${props => props.theme.background.hover};
		border-color: ${props => props.theme.background.hover};
	}

	@media screen and (max-width: 700px) {
		padding: ${rem(8)} ${rem(16)};
		margin: 0.5rem;
		border-radius: 0.25rem;
	}

	transition: 0.25s all ease-in;
`;

export const InfoContainer = styled.div`
	height: 100%;
	width: 100%;
	margin-left: 1.5rem;

	> h3 {
		margin: 0;
	}

	> div {
		margin: 0;
		width: 100%;
		display: flex;
	}

	p {
		margin: 0;
	}

	blockquote {
		margin-left: ${rem(16)};
		margin-top: ${rem(4)};
		color: ${props => props.theme.text.muted};
	}

	@media screen and (max-width: 500px) {
		margin-left: 0.5rem;
	}
`;

export const DisplayName = styled.h3`
	> a {
		color: unset;
		text-decoration: none;

		:visited {
			color: unset;
			text-decoration: none;
		}
		:hover {
			color: unset;
			text-decoration: none;
		}
	}
`;

export const FeedPostPreview = styled.div`
	color: #a8a8a8;
	display: flex;
	> p {
		line-break: normal;
		margin: 0;
	}

	> :first-child {
		flex-basis: 95%;
		margin-right: 1rem;
	}

	@media screen and (max-width: 700px) {
		margin: 3rem 1rem 1rem;
		> :first-child {
			flex-basis: 90%;
		}
	}
`;

type FeedPreviewProps = {
	avatar?: string;
	displayName: string;
	post?: {
		content: string;
		timestamp: string;
	};
};

export const FeedPreview = (props: FeedPreviewProps) => {
	const { avatar, displayName, post } = props;

	return (
		<Wrapper>
			<Avatar src={avatar ?? DEFAULT_AVATAR} size='lg' radius='xl' />
			<InfoContainer>
				<DisplayName>{displayName}</DisplayName>
				{post && (
					<FeedPostPreview>
						<p>{post.content}</p>
						<p>{post.timestamp}</p>
					</FeedPostPreview>
				)}
			</InfoContainer>
		</Wrapper>
	);
};
