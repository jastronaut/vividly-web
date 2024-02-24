import { useState, useMemo, useEffect } from 'react';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import {
	Text,
	Flex,
	Button,
	TextInput,
	Space,
	Title,
	Badge,
	Collapse,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';

import { makeApiCall } from '@/utils';
import { DefaultResponse } from '@/types/api';
import { useCurUserContext } from '../contexts/CurUserContext';
import { showAndLogErrorNotification } from '@/showerror';

type EmailSettingProps = {
	email: string;
	newEmail: string | null;
	isVerified: boolean;
};

export const EmailSetting = (props: EmailSettingProps) => {
	const { isVerified, email, newEmail } = props;
	const [newData, setNewData] = useState('');
	const { token } = useCurUserContext().curUser;

	const submitEmail = async (updatedEmail: string) => {
		try {
			if (updatedEmail === newEmail) {
				return;
			}

			const res = await makeApiCall<DefaultResponse>({
				uri: '/auth/email/change',
				method: 'POST',
				body: { updatedEmail },
				token: token,
			});

			if (res.error) {
				throw new Error(res.error);
			}

			notifications.show({
				message:
					'Email updated successfully. Check your inbox for a verification email.',
				color: 'green',
				title: 'Success',
			});
		} catch (err) {
			showAndLogErrorNotification(`Couldn't update email.`, err);
		}
	};

	const resendVerificationEmail = async () => {
		try {
			const res = await makeApiCall<DefaultResponse>({
				uri: `/auth/verify-email/resend`,
				method: 'POST',
				token,
			});

			if (res.error) {
				throw new Error(res.error);
			}

			notifications.show({
				message: 'Verification email sent.',
				color: 'green',
				title: 'Success',
			});
		} catch (err) {
			showAndLogErrorNotification(`Couldn't resend verification email.`, err);
		}
	};

	const isDataValid = useMemo(() => {
		return (
			newData.includes('@') && newData.includes('.') && newData.length >= 5
		);
	}, [newData]);

	return (
		<>
			<SettingSection
				title={'Email'}
				data={
					<>
						<Text>
							{newEmail ?? email}
							{` `}
							<Badge color={isVerified ? 'teal' : 'red'} radius='xs'>
								{isVerified ? 'Verified' : 'Not verified'}
							</Badge>
						</Text>
					</>
				}
			>
				<div>
					<TextInput
						placeholder='New email'
						type='email'
						value={newData}
						onChange={e => setNewData(e.currentTarget.value)}
						minLength={5}
					/>
					{!isVerified && (
						<>
							<Space h='xs' />
							<Button
								variant='outline'
								color='teal'
								size='xs'
								compact
								onClick={resendVerificationEmail}
							>
								Resend verification email
							</Button>
							{newEmail && (
								<>
									<Space h='xs' />
									<Text size='sm' c='dimmed'>
										Previous email: {email}
									</Text>
								</>
							)}
						</>
					)}
				</div>
				<Button onClick={() => submitEmail(newData)} disabled={!isDataValid}>
					Save
				</Button>
			</SettingSection>
		</>
	);
};

export const PasswordSetting = () => {
	const { token } = useCurUserContext().curUser;
	const [newPassword1, setNewPassword1] = useState('');
	const [newPassword2, setNewPassword2] = useState('');
	const [error, setError] = useState('');

	useEffect(() => {
		if (newPassword1 === newPassword2) {
			setError('');
		} else {
			setError(`Passwords don't match.`);
		}
	}, [newPassword1, newPassword2]);

	const onSubmit = async () => {
		setError('');

		if (newPassword1.length < 5) {
			setError(`Password must be at least 5 characters.`);
			return;
		}

		try {
			const res = await makeApiCall<DefaultResponse>({
				uri: '/auth/password/change',
				method: 'POST',
				body: { password: newPassword1 },
				token: token,
			});

			if (res.error) {
				throw new Error(res.error);
			}

			notifications.show({
				message: 'Password updated successfully.',
				color: 'green',
				title: 'Success',
			});

			setNewPassword1('');
			setNewPassword2('');
		} catch (err) {
			showAndLogErrorNotification(`Couldn't update password.`, err);
			setError(`Couldn't update password.`);
		}
	};

	return (
		<>
			<SettingSection
				title={'Password'}
				data={<Text>Change your password</Text>}
			>
				<div>
					<TextInput
						placeholder='New password'
						type='password'
						value={newPassword1}
						onChange={e => setNewPassword1(e.currentTarget.value)}
						minLength={5}
					/>

					<Space h='xs' />
					<TextInput
						placeholder='Confirm password'
						type='password'
						value={newPassword2}
						onChange={e => setNewPassword2(e.currentTarget.value)}
						minLength={5}
						error={error}
					/>
				</div>
				<Button
					onClick={onSubmit}
					disabled={!!error || !newPassword1 || !newPassword2}
				>
					Save
				</Button>
			</SettingSection>
		</>
	);
};

type SettingSectionProps = {
	title: string;
	data: React.ReactNode;

	children: React.ReactNode;
};

export const SettingSection = (props: SettingSectionProps) => {
	const { title } = props;
	const [opened, { toggle }] = useDisclosure(false);

	return (
		<>
			<Title order={5}>{title}</Title>
			<Flex justify='space-between' align='center'>
				{props.data}
				<Button
					variant='subtle'
					onClick={toggle}
					rightIcon={
						opened ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />
					}
				>
					Edit
				</Button>
			</Flex>
			<Space h='xs' />
			<Collapse in={opened}>
				<Flex justify='space-between' align='start'>
					{props.children}
				</Flex>
				<Space h='xs' />
			</Collapse>
		</>
	);
};
