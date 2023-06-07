import styled from 'styled-components';
import { rem } from 'polished';

export const ProfileHeaderContainer = styled.div`
	padding-top: ${rem(50)};
	border: 1px solid ${props => props.theme.border.secondary};
	color: ${props => props.theme.text.primary};
	background-size: cover;

	@media screen and (max-width: 700px) {
		margin: 0;
	}
`;

export const ProfileContentContainer = styled.div`
	min-height: 70vh;
	padding-top: ${rem(70)};

	@media screen and (max-width: 800px) {
		padding-top: ${rem(25)};
	}
`;
