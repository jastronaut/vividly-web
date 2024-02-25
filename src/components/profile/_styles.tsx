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

export const ProfileContentContainer = styled.div<{
	$isLoading: boolean;
	$isOwnProfile: boolean;
}>`
	padding: ${rem(24)};
	display: flex;
	flex-direction: ${props => (props.$isLoading ? 'column' : 'column-reverse')};
	border-top: none;

	@media screen and (max-width: 800px) {
		padding-bottom: ${props => (props.$isOwnProfile ? 0 : rem(45))};
	}

	@media screen and (max-width: 500px) {
		padding: ${rem(8)} ${rem(12)} 0;
		border-bottom: none;
	}
`;

export const ContentWrapper = styled.div`
	@media screen and (min-width: 801px) {
		border: 1px solid ${props => props.theme.background.secondary};
	}
`;

export const BottomStuffContainer = styled.div``;
