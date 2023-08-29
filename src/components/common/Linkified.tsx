import Linkify from 'linkify-react';
import 'linkify-plugin-mention';

const options = {
	formatHref: {
		mention: (href: string) => `/profile/u${href}`,
	},
	defaultProtocol: 'https',
	// target: '_blank',
	className: 'linkified',
};

type Props = {
	children: React.ReactNode;
};

export const Linkified = (props: Props) => {
	return <Linkify options={options}>{props.children}</Linkify>;
};
