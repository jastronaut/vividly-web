import { MusicElement } from '@/types/editor';
import { useMediaQuery } from '@mantine/hooks';

export const MusicBlock = (
	props: Partial<MusicElement> & { inEditor?: boolean }
) => {
	const isMobile = useMediaQuery('(max-width: 800px)');
	const {
		appleMusicEmbedUrl,
		spotifyEmbedUrl,
		youtubeEmbedUrl,
		inEditor = false,
	} = props;

	let embed = null;

	if (spotifyEmbedUrl) {
		embed = (
			<iframe
				style={{ borderRadius: '12px', maxHeight: '80px', border: 'none' }}
				src={spotifyEmbedUrl}
				width='100%'
				allow='fullscreen'
				loading='lazy'
			></iframe>
		);
	} else if (appleMusicEmbedUrl) {
		embed = (
			<iframe
				allow='fullscreen'
				height='175'
				style={{
					borderRadius: '12px',
					width: '100%',
					maxWidth: '660px',
					overflow: 'hidden',
					border: 'none',
				}}
				sandbox='allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation'
				src={appleMusicEmbedUrl}
			></iframe>
		);
	} else if (youtubeEmbedUrl) {
		embed = (
			<iframe
				width={inEditor ? '95%' : isMobile ? '100%' : '480px'}
				height='315'
				style={{
					borderRadius: '12px',
					border: 'none',
				}}
				src={youtubeEmbedUrl}
				title='YouTube video player'
				allow='accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share'
			></iframe>
		);
	}

	return <div>{embed}</div>;
};
