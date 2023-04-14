import styled from 'styled-components';
import { rem } from 'polished';
import Image from 'next/image';

export const Avatar = styled(Image)<{ size?: number }>`
	border-radius: ${props => (props.size ? rem(props.size / 2) : rem(50))};
	width: ${props => (props.size ? rem(props.size) : rem(50))};
	height: ${props => (props.size ? rem(props.size) : rem(50))};
	display: flex;
`;
