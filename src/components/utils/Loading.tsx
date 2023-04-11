import { Text } from '@mantine/core';
import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';

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
		transform: translateY(2rem);
		}
	}
`;

const LoadingIcon = styled.div`
	font-size: 2rem;
	animation: 1s linear infinite alternate levitate;
`;

export const Loading = () => (
	<>
		<Animations />
		<Page>
			<LoadingContainer>
				<LoadingIcon>
					<span role='img' aria-label='Loading indicator'>
						🔮
					</span>
				</LoadingIcon>
				<Text
					sx={{
						marginTop: '1.5rem',
					}}
					c='dimmed'
				>
					Loading...
				</Text>
			</LoadingContainer>
		</Page>
	</>
);

const MiniLoaderWrapper = styled.p`
	display: inline;
	display: inline-block;
	margin: 0 1rem;
	font-size: 1rem;
	width: 1rem;
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
