import styled from 'styled-components';
import { rem } from 'polished';

import { Block } from '../../types/post';
// import {
// 	TextBlockContent,
// 	ImageBlockContent,
// 	MusicBlockContent,
// } from './post/Blocks';

const PostWrapper = styled.div`
	background: ${props => props.theme.background.primary};

	border: ${rem(1)} solid ${props => props.theme.border.secondary};
	border-top: none;

	:first-of-type {
		border-top: ${rem(1)} solid ${props => props.theme.border.secondary};
	}

	color: ${props => props.theme.text.primary};
	word-wrap: break-word;
	padding: ${rem(32)} ${rem(48)};

	@media screen and (max-width: 800px) {
		margin: 0;
		padding: ${rem(24)} ${rem(16)} ${rem(16)};
		:last-of-type {
			padding-bottom: ${rem(24)};
			margin-bottom: ${rem(32)};
		}
	}
`;

export type PostProps = {
	children: React.ReactNode;
	blocks: Block[];
};

export const Post = (props: PostProps) => {
	const renderedBlocks = props.blocks.map((block, index) => {
		switch (block.type) {
			// case 'text':
			// 	return <TextBlockContent key={index} {...block} />;
			// case 'image':
			// 	return <ImageBlockContent key={index} {...block} />;
			// case 'music':
			// 	return <MusicBlockContent key={index} {...block} />;
			default:
				return null;
		}
	});

	return <PostWrapper>{renderedBlocks}</PostWrapper>;
};
