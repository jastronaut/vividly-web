import { TabsWrapper, Tabs } from './_style';

const ActivityComponent = () => {
	return (
		<div>
			ho
			<TabsWrapper>
				<Tabs defaultValue='comments' variant='pills' color='pink'>
					<Tabs.List>
						<Tabs.Tab value='comments'>Comments</Tabs.Tab>
						<Tabs.Tab value='mentions'>Mentions</Tabs.Tab>
						<Tabs.Tab value='likes'>Likes</Tabs.Tab>
					</Tabs.List>
					<Tabs.Panel value='comments' pt='xs'>
						Comments
					</Tabs.Panel>
					<Tabs.Panel value='mentions' pt='xs'>
						Mentions
					</Tabs.Panel>
					<Tabs.Panel value='likes' pt='xs'>
						Likes
					</Tabs.Panel>
				</Tabs>
			</TabsWrapper>
		</div>
	);
};

export default function Activity() {
	return (
		<>
			<ActivityComponent />
		</>
	);
}
