import styled from 'styled-components';
import { rem } from 'polished';

export const RegisterContainer = styled.div`
	height: 100vh;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	text-align: center;
	color: ${props => props.theme.text.primary};
	button {
		box-shadow: 2px 2px 2px #2d2d2d50;
	}

	button:hover {
		transition: all 0.15s ease;
		box-shadow: 3px 3px 3px #2d2d2d50;
	}
`;

export const StyledContainer = styled.div`
	background-color: ${props => props.theme.background.primary};
	padding: ${rem(32)} ${rem(48)};
	border-radius: ${rem(8)};
`;
