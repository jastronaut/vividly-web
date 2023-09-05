import styled, { createGlobalStyle } from 'styled-components';

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

type Props = {
	children: React.ReactNode;
};

const GradientLayout = (props: Props) => {
	return (
		<>
			<GlobalStyle />
			<Background>{props.children}</Background>
		</>
	);
};

export default GradientLayout;
