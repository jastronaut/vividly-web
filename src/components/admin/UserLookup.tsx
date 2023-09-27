import {
	TextInput,
	Title,
	Select,
	Button,
	Group,
	Text,
	Divider,
	Space,
	Table,
	Card,
} from '@mantine/core';
import { useState } from 'react';

import { useCurUserContext } from '../contexts/CurUserContext';
import { Avatar } from '../common/Avatar';
import { AdminUserLookupResponse } from '@/types/api';
import { showAndLogErrorNotification } from '@/showerror';
import { makeApiCall } from '@/utils';
import { useAccountInfoContext } from '../contexts/AccountInfoContext';

export const UserLookup = () => {
	const { curUser } = useCurUserContext();
	const { accountInfo } = useAccountInfoContext();
	const [lookupMethod, setLookupMethod] = useState('Username');
	const [email, setEmail] = useState('');
	const [username, setUsername] = useState('');
	const [id, setId] = useState('');
	const [error, setError] = useState(null);
	const [user, setUser] = useState<AdminUserLookupResponse | null>(null);

	const lookupUser = async () => {
		setUser(null);
		if (!curUser.token) return;
		let url = `/admin/user`;
		if (username === '' && email === '' && id === '') {
			return;
		}

		if (lookupMethod === 'Username') {
			url += `/username/${username}`;
		} else if (lookupMethod === 'Email') {
			url += `/email/${email}`;
		} else {
			url += `/id/${id}`;
		}
		try {
			const resp = await makeApiCall<AdminUserLookupResponse>({
				uri: url,
				method: 'GET',
				token: curUser.token,
			});

			if (resp.error) {
				throw new Error(resp.error);
				return;
			}

			console.log('the resp, ', resp);
			// console.log('pls', resp.authUser);

			setUser({ ...resp });
		} catch (e) {
			showAndLogErrorNotification('Error looking up user.', e);
		}
	};

	if (!accountInfo || !accountInfo.authUser.isAdmin) {
		return <Title>No.</Title>;
	}

	return (
		<>
			<Divider
				size='sm'
				labelPosition='left'
				label={
					<>
						<Title order={2}>User lookup</Title>
					</>
				}
			/>
			<Space h='md' />
			<Group>
				<Select
					value={lookupMethod}
					onChange={(value: string) => setLookupMethod(value)}
					data={['Username', 'Email', 'ID']}
				/>
				{lookupMethod === 'Username' ? (
					<TextInput
						placeholder='Username'
						autoComplete='off'
						onChange={e => setUsername(e.target.value)}
					/>
				) : lookupMethod === 'Email' ? (
					<TextInput
						placeholder='Email'
						autoComplete='off'
						onChange={e => setEmail(e.target.value)}
					/>
				) : (
					<TextInput
						placeholder='ID'
						autoComplete='off'
						onChange={e => setId(e.target.value)}
					/>
				)}
				<Button onClick={lookupUser}>Look up</Button>
				{error && <Text color='red'>{error}</Text>}
			</Group>
			<Space h='md' />
			{!user || !user.user.authUser ? null : (
				<>
					<Card>
						<Group align='top'>
							<Avatar src={user.user.avatarSrc} alt='' />
							<div>
								<Text fw={700}>{user.user.name}</Text>
								<Text size='sm' c='dimmed'>
									@{user.user.username}
								</Text>
								<Text>{user.user.bio}</Text>
								<Space h='sm' />
								<Group>
									<Button variant='outline' size='xs'>
										Toggle admin status
									</Button>
									<Button variant='outline' size='xs'>
										Resend verification email
									</Button>
								</Group>
							</div>
						</Group>
					</Card>
					<Space h='sm' />

					<div>
						<Table highlightOnHover withBorder withColumnBorders>
							<tbody>
								<tr>
									<td>Email</td>
									<td>{user.user.authUser.email}</td>
								</tr>
								<tr>
									<td>URL</td>
									<td>{user.user.url || 'Null'} </td>
								</tr>
								<tr>
									<td>Is Deactivated</td>
									<td>{user.user.isDeactivated ? 'Yes' : 'No'}</td>
								</tr>
								<tr>
									<td>Is Admin</td>
									<td>{user.user.authUser.isAdmin ? 'Yes' : 'No'}</td>
								</tr>
								<tr>
									<td>Email Verified</td>
									<td>{user.user.authUser.emailVerified ? 'Yes' : 'No'}</td>
								</tr>
								<tr>
									<td>Verification Code</td>
									<td>{user.user.authUser.verificationCode || 'Null'}</td>
								</tr>
								<tr>
									<td>Verification Expires At</td>
									<td>{user.user.authUser.verificationExpiresAt || 'Null'}</td>
								</tr>
								<tr>
									<td>Reset Code</td>
									<td>{user.user.authUser.resetCode || 'Null'}</td>
								</tr>
							</tbody>
						</Table>
					</div>
					<Space h='md' />
					<Title order={3}>Friends</Title>
					<Space h='md' />
					<Title order={3}>Reports</Title>
					<Space h='xs' />
					<Table striped highlightOnHover withBorder withColumnBorders>
						<thead>
							<tr>
								<th>Report ID</th>
								<th>Reason</th>
								<th>Item ID</th>
								<th>Item Type</th>
								<th>Created At</th>
							</tr>
						</thead>
						<tbody>
							{user.user.reports.map(report => (
								<tr key={report.id}>
									<td>{report.id}</td>
									<td>{report.reason}</td>
									<td>{report.itemId}</td>
									<td>{report.itemType}</td>
									<td>{report.createdAt}</td>
								</tr>
							))}
						</tbody>
					</Table>
					<Space h='md' />
				</>
			)}
		</>
	);
};
