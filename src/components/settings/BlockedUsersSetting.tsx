import { useCallback, useState } from 'react';
import {
	Title,
	Button,
	Menu,
	ActionIcon,
	Text,
	Collapse,
	Space,
} from '@mantine/core';
import useSWR from 'swr';
import styled from 'styled-components';
import { IconChevronUp, IconDots, IconChevronDown } from '@tabler/icons-react';
import { rem } from 'polished';
import { modals } from '@mantine/modals';

import { fetchWithToken, makeApiCall } from '@/utils';
import { useCurUserContext } from '../contexts/CurUserContext';
import { URL_PREFIX } from '@/constants';
import { BlockedUsersResponse, DefaultResponse } from '@/types/api';
import { Avatar } from '../common/Avatar';
import { DismissWarningModal } from '../common/DismissWarningModal';
import { Loading } from '../common/Loading';
import Link from 'next/link';

const UsersWrapper = styled.div`
	padding: ${rem(10)};
	display: grid;
	grid-template-columns: ${rem(30)} 1fr ${rem(30)};
	grid-template-rows: 1fr;
	gap: ${rem(10)};
	.mantine-Text-root {
		line-height: 1.2;
	}
`;

const InfoWrapper = styled.div`
	display: flex;
	justify-content: space-between;
`;

export const BlockedUsersSetting = () => {
	const { curUser } = useCurUserContext();
	const { token } = curUser;

	const [isListVisible, setIsListVisible] = useState(false);

	const { data, error, isLoading, mutate } = useSWR<BlockedUsersResponse>(
		[token && isListVisible ? `${URL_PREFIX}/blocked_users` : '', token],
		([url, token]: [string, string]) => fetchWithToken(url, token),
		{ shouldRetryOnError: true }
	);

	const tryClose = useCallback(
		(id: number) => {
			const close = async () => {
				try {
					const resp = await makeApiCall<DefaultResponse>({
						uri: `/blocked_users/unblock/${id}`,
						method: 'POST',
						token,
					});

					if (!resp.success) {
						console.error(resp.error);
						return;
					}

					mutate();
				} catch (err) {
					console.error(err);
				}
			};

			modals.openConfirmModal({
				centered: true,
				children: <Text ta='center'>Unblock user?</Text>,
				labels: { confirm: 'Confirm', cancel: 'Cancel' },
				confirmProps: { color: 'red' },
				onCancel: () => {},
				onConfirm: close,
				withCloseButton: false,
			});
		},
		[mutate]
	);

	return (
		<div>
			<Title order={5}>Blocked users</Title>

			<InfoWrapper>
				<Text>Manage blocked users</Text>
				<Button
					variant='subtle'
					onClick={() => setIsListVisible(i => !i)}
					rightIcon={
						isListVisible ? (
							<IconChevronUp size='1rem' />
						) : (
							<IconChevronDown size='1rem' />
						)
					}
				>
					Edit
				</Button>
			</InfoWrapper>
			<Collapse in={isListVisible}>
				{isLoading || !data ? (
					<Loading />
				) : data.length < 1 ? (
					<Text c='dimmed'>No users to show!</Text>
				) : (
					data.map(user => (
						<UsersWrapper key={`blocked-${user.blockedUser.id}`}>
							<Link href={`/profile/${user.blockedUser.id}`}>
								<Avatar
									src={user.blockedUser.avatarSrc}
									alt={`Avatar of ${user.blockedUser.username}`}
									size={30}
								/>
							</Link>
							<div>
								{user.blockedUser.name ? (
									<Text fw='bold'>{user.blockedUser.name}</Text>
								) : null}
								<Text c='dimmed'>@{user.blockedUser.username}</Text>
							</div>
							<Menu position='bottom-end' withArrow offset={0}>
								<Menu.Target>
									<ActionIcon>
										<IconDots size={14} />
									</ActionIcon>
								</Menu.Target>
								<Menu.Dropdown>
									<Menu.Item onClick={() => tryClose(user.blockedUser.id)}>
										Unblock user
									</Menu.Item>
								</Menu.Dropdown>
							</Menu>
						</UsersWrapper>
					))
				)}
			</Collapse>
			<Space h='sm' />
		</div>
	);
};
