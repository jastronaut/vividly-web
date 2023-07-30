import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from './useAuth';
import { NextPage } from 'next';

interface Props {
	[key: string]: any;
}

export function withAuth(WrappedComponent: NextPage<any, any>) {
	const Wrapper = (props: Props) => {
		const { curUser, isLoading } = useAuth();
		const router = useRouter();

		useEffect(() => {
			if ((!curUser || !curUser.token) && !isLoading) {
				console.log(curUser);
				router.push('/login'); // redirect if there is no user
			}
		}, [curUser]);

		return <WrappedComponent {...props} />;
	};

	// Copy getInitial props so it will run as well
	if (WrappedComponent.getInitialProps) {
		Wrapper.getInitialProps = WrappedComponent.getInitialProps;
	}

	return Wrapper;
}
