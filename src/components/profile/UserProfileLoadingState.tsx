import styled from 'styled-components';

import { Loading } from '../common/Loading';

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
