import { IconSun, IconMoonStars } from '@tabler/icons-react';
import { Switch, Space, Title, Divider } from '@mantine/core';
import { notifications } from '@mantine/notifications';

import { makeApiCall } from '@/utils';
import { DefaultResponse } from '@/types/api';
import { Page } from '../_app';
import { useVividlyTheme, ThemeName } from '@/styles/Theme';
import {
	CurUserProvider,
	useCurUserContext,
} from '@/components/utils/CurUserContext';
import AppShellLayout from '@/components/layout/AppShellLayout';
import { Loading } from '@/components/utils/Loading';
import {
	AccountInfoProvider,
	useAccountInfoContext,
} from '@/components/utils/AccountInfoContext';
import { TextInputSetting } from '@/components/settings/TextInputSetting';
import { showAndLogErrorNotification } from '@/showerror';

const PageContent = (props: { token: string }) => {
	const { accountInfo } = useAccountInfoContext();
	const {
		setTheme,
		theme: vividlyTheme,
		useSystemTheme,
		setUseSystemTheme,
	} = useVividlyTheme();
	const onClickChangeTheme = () => {
		setTheme(
			vividlyTheme === ThemeName.Light ? ThemeName.Dark : ThemeName.Light
		);
		setUseSystemTheme(false);
	};

	const checkPrefersColorScheme = () => {
		if (!window.matchMedia) return;

		if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
			setTheme(ThemeName.Dark);
		} else {
			setTheme(ThemeName.Light);
		}
	};

	const onToggleSystemTheme = () => {
		if (useSystemTheme) {
			setUseSystemTheme(false);
			window
				.matchMedia('(prefers-color-scheme: dark)')
				.removeEventListener('change', checkPrefersColorScheme);
		} else {
			setUseSystemTheme(true);
			checkPrefersColorScheme();
			window
				.matchMedia('(prefers-color-scheme: dark)')
				.addEventListener('change', checkPrefersColorScheme);
		}
	};

	const submitEmail = async (email: string) => {
		try {
			const res = await makeApiCall<DefaultResponse>({
				uri: '/users/email/change',
				method: 'POST',
				body: { email },
				token: props.token,
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

	if (!accountInfo || !accountInfo.authUser)
		return (
			<>
				<Loading />
			</>
		);

	return (
		<>
			<Divider
				size='sm'
				labelPosition='left'
				label={
					<>
						<Title order={2}>Theme</Title>
					</>
				}
			/>
			<Switch
				label='Use system theme'
				checked={useSystemTheme}
				onChange={onToggleSystemTheme}
			/>
			<Space h='xs' />
			<Switch
				label='Use dark theme'
				offLabel={<IconSun size='1rem' stroke={2.5} />}
				onLabel={<IconMoonStars size='1rem' stroke={2.5} />}
				disabled={useSystemTheme}
				checked={vividlyTheme === ThemeName.Light ? false : true}
				onChange={onClickChangeTheme}
			/>
			<Space h='md' />
			<Divider
				size='sm'
				labelPosition='left'
				label={
					<>
						<Title order={2}>Account</Title>
					</>
				}
			/>
			<Space h='sm' />
			<TextInputSetting
				title='Email'
				data={accountInfo.authUser.email}
				placeholder='New email'
				type='email'
				onSave={submitEmail}
			/>
			<Divider size='xs' />
		</>
	);
};

const SettingsPage: Page = () => {
	const { curUser, isLoading } = useCurUserContext();

	return (
		<>
			<AppShellLayout id={curUser.user?.id}>
				{!curUser.token || isLoading ? (
					<Loading />
				) : (
					<PageContent token={curUser.token} />
				)}
			</AppShellLayout>
		</>
	);
};

SettingsPage.getLayout = (page: React.ReactNode) => {
	return (
		<CurUserProvider>
			<AccountInfoProvider>{page}</AccountInfoProvider>
		</CurUserProvider>
	);
};

export default SettingsPage;
