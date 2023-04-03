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
