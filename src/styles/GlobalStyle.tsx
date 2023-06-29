import { createGlobalStyle } from 'styled-components';
import { rem } from 'polished';

export const GlobalStyle = createGlobalStyle`
    html {
        height: 100%;
    }

    body {
        margin: 0;
        padding: 0;
        -moz-osx-font-smoothing: grayscale;
        margin: 0;
        overflow: auto;
        background-color: ${props => props.theme.background.accented};
        font-family: 'Lato', sans-serif;
        transition: all 0.2s ease-in;
    }

    h1, h2, h3 {
        font-family: 'Montserrat', sans-serif;
    }
    
    a, a:visited {
        text-decoration: none;
        color: ${props => props.theme.accent};
    }

    * {
        box-sizing: border-box;
    }

	@keyframes riseandfade {
		from {
			opacity: 0;
			transform: translateY(${rem(10)});
		}

		to {
			transform: translateY(0);
            opacity: 1;
		}
	}

    // mantine global styles
    // for some reason these fonts won't work with the mantine theme object
   .mantine-Button-label, .mantine-Input-input, .ql-editor {
        font-family: 'Lato', sans-serif;
   }
`;
