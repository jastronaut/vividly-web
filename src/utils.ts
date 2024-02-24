import { URL_PREFIX } from './constants';
import confetti from 'canvas-confetti';

// fetcher for swr
export const fetcher = async (url: string) => {
	const res = await fetch(url);
	if (!res.ok) {
		const error = new Error('An error occurred while fetching the data.');
		throw error;
	}
	return res.json();
};

export const fetchWithToken = async (url: string, token: string) => {
	const res = await fetch(url, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	if (!res.ok) {
		const error = new Error('An error occurred while fetching the data.');
		throw error;
	}
	return res.json();
};

type MakeApiCallProps = {
	body?: any;
	token?: string;
	method?: string;
	uri: string;
};

type Request = {
	method: string;
	headers: {
		[key: string]: string;
	};
	body?: string;
};

export async function makeApiCall<T>(props: MakeApiCallProps): Promise<T> {
	const request: Request = {
		method: props.method ?? 'GET',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
	};

	if (props.token) {
		request.headers['Authorization'] = `Bearer ${props.token}`;
	}

	if (props.body) {
		request.body = JSON.stringify(props.body);
	}

	return fetch(URL_PREFIX + props.uri, request)
		.catch(err => {
			console.error(err);
			throw new Error(
				`Cannot make call to ${props.uri}. Please contact peached.app@gmail.com`
			);
		})
		.then(response => response.json());
}

export function throwConfetti() {
	confetti({
		particleCount: 100,
		startVelocity: 30,
		spread: 360,
	});
}
