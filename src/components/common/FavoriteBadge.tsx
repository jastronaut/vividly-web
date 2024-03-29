import { Badge } from '@mantine/core';
import { rem } from 'polished';
import { IconStarFilled } from '@tabler/icons-react';

export const FavoriteBadge = () => {
	return (
		<Badge
			sx={{
				marginLeft: rem(5),
				border: 'none',
				padding: 0,
			}}
			color='yellow'
			size='xs'
			variant='outline'
		>
			<IconStarFilled size={10} />
		</Badge>
	);
};
