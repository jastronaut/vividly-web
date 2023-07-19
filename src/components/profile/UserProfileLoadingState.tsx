import styled from 'styled-components';

import { Loading } from '../utils/Loading';

const Container = styled.div`
	min-height: calc(100vh - 60px);
`;

export const UserProfileLoadingState = () => {
	return (
		<Container>
			<Loading />
		</Container>
	);
};
