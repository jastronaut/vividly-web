import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

const proxy = async (req: NextApiRequest, res: NextApiResponse) => {
	let url = req.query.params;

	// Array check, join parts if necessary
	if (Array.isArray(url)) {
		url = url.join('/');
	}

	// Validate URL here, return error if invalid
	if (!url || url.includes(',')) {
		return res.status(400).json({ error: 'Invalid URL' });
	}

	try {
		const response = await fetch(`https://${url}`);
		const text = await response.text();
		console.log('here');
		return res.status(200).send(text);
	} catch (error) {
		console.log('here2');
		return res.status(500).json({ error: `${error}` || 'Unexpected Error' });
	}
};

export default proxy;
