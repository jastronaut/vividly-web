import { IconSun, IconMoonStars } from '@tabler/icons-react';
import { Switch, Space, Title, Divider, Button, Center } from '@mantine/core';
import { rem } from 'polished';
import styled from 'styled-components';
import Link from 'next/link';

import { Page } from '../_app';
import { useVividlyTheme, ThemeName } from '@/styles/Theme';
import { useCurUserContext } from '@/components/utils/CurUserContext';
import { Loading } from '@/components/utils/Loading';
import {
	AccountInfoProvider,
	useAccountInfoContext,
} from '@/components/utils/AccountInfoContext';
import {
	EmailSetting,
	PasswordSetting,
} from '@/components/settings/TextInputSetting';
import AppLayout from '@/components/layout/AppLayout';
import { FadeIn } from '@/styles/Animations';

const PageContainer = styled.div`
	margin: ${rem(48)} ${rem(128)};

	@media screen and (max-width: 800px) {
		margin: ${rem(8)} ${rem(64)};
	}

	@media screen and (max-width: 500px) {
		margin: ${rem(8)} ${rem(8)};
	}
`;

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
			<EmailSetting
				email={accountInfo.authUser.email}
				isVerified={accountInfo.authUser.emailVerified}
			/>
			<Divider size='xs' />
			<Space h='sm' />
			<PasswordSetting />

			<Space h='lg' />
			<Center>
				<Link href='/feedback'>
					<Button variant='light' component='span'>
						Feedback
					</Button>
				</Link>
			</Center>
		</>
	);
};

const SettingsPage: Page = () => {
	const { curUser } = useCurUserContext();

	return (
		<>
			<FadeIn>
				<PageContainer>
					<PageContent token={curUser.token} />
				</PageContainer>
			</FadeIn>
		</>
	);
};

SettingsPage.getLayout = (page: React.ReactNode) => {
	return (
		<AppLayout>
			<AccountInfoProvider>{page}</AccountInfoProvider>
		</AppLayout>
	);
};

export default SettingsPage;
