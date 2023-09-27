import { Title, Table, Divider, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import useSWRInfite from 'swr/infinite';

import { usePostDrawerContext } from '../contexts/PostDrawerContext';
import { useCurUserContext } from '../contexts/CurUserContext';
import { uri } from '@/constants';
import { fetchWithToken } from '@/utils';
import { Report } from '@/types/api';

type ReportsResponse = {
	data: Report[];
	cursor: string | null;
};

const ReportItem = (props: Report) => {
	const { setPostId } = usePostDrawerContext();

	const onClickItem = () => {
		if (props.itemType === 'post') {
			setPostId(props.itemId);
		}
	};

	return (
		<tr key={props.id}>
			<td onClick={onClickItem}>{props.id}</td>
			<td>{props.itemId}</td>
			<td>{props.itemType}</td>
			<td>
				{props.reporter.id}, @{props.reporter.username}
			</td>
		</tr>
	);
};

export const ManageReports = () => {
	const { curUser } = useCurUserContext();
	const [lookupMethod, setLookupMethod] = useState('Username');
	const [email, setEmail] = useState('');
	const [username, setUsername] = useState('');
	const [id, setId] = useState('');

	const [error, setError] = useState<string>('');

	const {
		data = [],
		error: reportError,
		isLoading: isReportLoading,
	} = useSWRInfite<ReportsResponse>(
		(pageIndex: number, previousPageData: ReportsResponse | null) => {
			if (!curUser.token || (previousPageData && !previousPageData.cursor))
				return null;
			return [`${uri}/reports?cursor=${pageIndex}`, curUser.token];
		},
		([url, token]: [string, string]) => fetchWithToken(url, token),
		{ shouldRetryOnError: false, refreshInterval: 15000 }
	);

	useEffect(() => {
		if (reportError) {
			console.error(reportError);
			setError('Could not load reports');
		}
	}, [reportError]);

	const onClickLookup = async () => {
		setError('');
		try {
			if (lookupMethod === 'Username') {
				if (username.length < 3) return;
			} else if (lookupMethod === 'Email') {
				if (email.length < 5) return;
			} else {
				if (!id) {
					return;
				}
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>
			<Divider
				size='sm'
				labelPosition='left'
				label={
					<>
						<Title order={2}>Reports</Title>
					</>
				}
			/>
			{error !== null ? <Text color='red'>{error}</Text> : null}
			<Table striped highlightOnHover withBorder withColumnBorders>
				<thead>
					<tr>
						<th>ID</th>
						<th>Item ID</th>
						<th>Item Type</th>
						<th>Reporter</th>
					</tr>
				</thead>

				<tbody>
					{data.map((page, i) => (
						<>
							{page.data.map(report => (
								<ReportItem key={`report-${report.id}`} {...report} />
							))}
						</>
					))}
				</tbody>
			</Table>
		</>
	);
};
