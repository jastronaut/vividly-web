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
