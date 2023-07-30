import { Text } from '@mantine/core';
import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { rem } from 'polished';

const Page = styled.div`
	display: flex;
	width: 100%;
	height: 100%;
	justify-content: center;
	align-content: center;
	align-items: center;
	text-align: center;
`;

const LoadingContainer = styled.div``;

const Animations = createGlobalStyle`
	@keyframes levitate {
		from {
			transform: none;
		}

		to {
		transform: translateY(${rem(16)});
		}
	}
`;

const LoadingIcon = styled.div`
	font-size: ${rem(16)};
	animation: 1s linear infinite alternate levitate;
`;

type LoadingProps = {
	messageHidden?: boolean;
};

export const Loading = (props: LoadingProps) => (
	<>
		<Animations />
		<Page>
			<LoadingContainer>
				<LoadingIcon>
					<span role='img' aria-label='Loading indicator'>
						🔮
					</span>
				</LoadingIcon>
				{!props.messageHidden && (
					<Text
						sx={{
							marginTop: '1.5rem',
						}}
						c='dimmed'
					>
						Loading...
					</Text>
				)}
			</LoadingContainer>
		</Page>
	</>
);

const MiniLoaderWrapper = styled.p`
	display: inline;
	display: inline-block;
	margin: 0 ${rem(16)};
	font-size: ${rem(24)};
	width: ${rem(16)};
	animation: spin 1s ease-in-out 1s infinite running;
`;

const MiniAnimation = createGlobalStyle`
	@keyframes spin {
	  0% {
		transform: rotate(0deg);
	  }
	  100% {
		transform: rotate(360deg);
	  }
	}
`;

export const MiniLoader = () => (
	<>
		<MiniAnimation />
		<MiniLoaderWrapper>
			<span role='img' aria-label='Loading indicator'>
				🔮
			</span>
		</MiniLoaderWrapper>
	</>
);
