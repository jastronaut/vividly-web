import styled from 'styled-components';
import { rem } from 'polished';

export const ProfileHeaderContainer = styled.div`
	padding-top: ${rem(50)};
	color: ${props => props.theme.text.primary};
	background-size: cover;

	@media screen and (max-width: 700px) {
		margin: 0;
	}
`;

export const ProfileContentContainer = styled.div<{ isLoading: boolean }>`
	padding: ${rem(24)};
	display: flex;
	flex-direction: ${props => (props.isLoading ? 'column' : 'column-reverse')};
	border-top: none;
	min-height: calc(100vh - 164px);

	@media screen and (max-width: 800px) {
		padding-bottom: ${rem(45)};
		min-height: calc(100vh - 190px);
	}

	@media screen and (max-width: 500px) {
		padding: ${rem(8)} ${rem(12)} 0;
		border-bottom: none;
	}
`;

export const ContentWrapper = styled.div`
	min-height: calc(100vh - 50px);

	@media screen and (min-width: 801px) {
		border: 1px solid ${props => props.theme.background.secondary};
	}
`;

export const BottomStuffContainer = styled.div``;
