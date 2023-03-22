// fetcher for swr
export const fetcher = (url: string) =>
	fetch(url)
		.then(res => res.json())
		.catch(err => console.error(err));

export const fetchWithToken = (url: string, token: string) =>
	fetch(url, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})
		.then(res => res.json())
		.catch(err => console.error(err));
