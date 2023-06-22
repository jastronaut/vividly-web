import styled, { createGlobalStyle } from 'styled-components';
import { rem } from 'polished';

export const GlobalStyle = createGlobalStyle`
	@-webkit-keyframes Gradient {
		0% {
		background-position: 0% 50%
		}
	50% {
		background-position: 100% 50%
	}
	100% {
		background-position: 0% 50%
	}
}

@-moz-keyframes Gradient {
  0% {
		background-position: 0% 50%
  }
	50% {
		background-position: 100% 50%
	}
	100% {
		background-position: 0% 50%
	}
}

@keyframes Gradient {
  0% {
		background-position: 0% 50%
  }
	50% {
		background-position: 100% 50%
	}
	100% {
		background-position: 0% 50%
	}
}
`;
export const Background = styled.div`
	width: 100%;
	color: #fff;
	background: linear-gradient(-45deg, #df4a1c, #e73c7e, #23a6d5, #05ce9f);
	background-size: 400% 400%;
	-webkit-animation: Gradient 15s ease infinite;
	-moz-animation: Gradient 15s ease infinite;
	animation: Gradient 15s ease infinite;
`;

export const RegisterContainer = styled.div`
	height: 100%;
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
