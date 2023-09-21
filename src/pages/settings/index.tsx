import { IconSun, IconMoonStars } from '@tabler/icons-react';
import {
	Switch,
	Space,
	Title,
	Divider,
	Button,
	Center,
	Select,
} from '@mantine/core';
import { rem } from 'polished';
import styled from 'styled-components';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { Page } from '../_app';
import { useVividlyTheme, ThemeName } from '@/styles/Theme';
import { useCurUserContext } from '@/components/contexts/CurUserContext';
import { Loading } from '@/components/common/Loading';
import {
	AccountInfoProvider,
	useAccountInfoContext,
} from '@/components/contexts/AccountInfoContext';
import {
	EmailSetting,
	PasswordSetting,
	BlockedUsersSetting,
	ColorSetting,
} from '@/components/settings';
import AppLayout from '@/components/layout/AppLayout';
import { FadeIn } from '@/styles/Animations';
import { useEffect } from 'react';
import {
	DateFormats,
	useLocalizationContext,
} from '@/components/contexts/LocalizationContext';
import dayjs from 'dayjs';

const PageContainer = styled.div`
	margin: ${rem(48)} ${rem(128)};

	@media screen and (max-width: 800px) {
		margin: ${rem(8)} ${rem(64)};
	}

	@media screen and (max-width: 500px) {
		margin: ${rem(8)} ${rem(8)};
	}
`;

const PageContent = () => {
	const { accountInfo } = useAccountInfoContext();
	const { logoutCurUser } = useCurUserContext();

	const {
		use24HourTime,
		toggleUse24HourTime,
		useCelsius,
		toggleUseCelsius,
		dateFormat,
		setDateFormat,
	} = useLocalizationContext();

	const router = useRouter();

	const {
		setTheme,
		theme: vividlyTheme,
		useSystemTheme,
		setUseSystemTheme,
	} = useVividlyTheme();

	const onClickChangeTheme = () => {
		const newTheme =
			vividlyTheme === ThemeName.Light ? ThemeName.Dark : ThemeName.Light;
		setTheme(newTheme);
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
			window
				.matchMedia('(prefers-color-scheme: dark)')
				.removeEventListener('change', checkPrefersColorScheme);
			setUseSystemTheme(false);
		} else {
			checkPrefersColorScheme();
			window
				.matchMedia('(prefers-color-scheme: dark)')
				.addEventListener('change', checkPrefersColorScheme);

			setUseSystemTheme(true);
		}
	};

	useEffect(() => {
		return () => {
			window
				.matchMedia('(prefers-color-scheme: dark)')
				.removeEventListener('change', checkPrefersColorScheme);
		};
	}, []);

	if (!accountInfo || !accountInfo.authUser)
		return (
			<>
				<Loading />
			</>
		);

	return (
		<>
			<Space h='lg' />
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
			<ColorSetting />
			<Space h='md' />
			<Divider
				size='sm'
				labelPosition='left'
				label={
					<>
						<Title order={2}>Formats</Title>
					</>
				}
			/>
			<Switch
				label='Use celsius'
				checked={useCelsius}
				onChange={toggleUseCelsius}
			/>
			<Space h='xs' />
			<Switch
				label='Use 24 hour time'
				checked={use24HourTime}
				onChange={toggleUse24HourTime}
			/>
			<Space h='xs' />
			<div style={{ maxWidth: '300px' }}>
				<Select
					label='Date format'
					value={dateFormat}
					onChange={(value: string) => setDateFormat(value)}
					data={[
						{ value: DateFormats.US, label: dayjs().format(DateFormats.US) },
						{ value: DateFormats.EU, label: dayjs().format(DateFormats.EU) },
					]}
					width='100px'
				/>
			</div>
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
			<Divider size='xs' />
			<Space h='sm' />
			<BlockedUsersSetting />

			<Divider size='xs' />
			<Space h='lg' />
			<Center>
				<Button variant='light' component='span'>
					<Link href='/feedback'>Feedback</Link>
				</Button>
			</Center>
			<Space h='lg' />
			<Center>
				<Button
					variant='outline'
					color='red'
					size='xs'
					onClick={() => {
						logoutCurUser();
						router.push('/login');
					}}
				>
					Logout
				</Button>
			</Center>
		</>
	);
};

const SettingsPage: Page = () => {
	const { isLoading } = useCurUserContext();

	return (
		<>
			<FadeIn>
				<PageContainer>
					{isLoading ? <Loading /> : <PageContent />}
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
