import { Block, BlockType } from '@/types/post';

export function getBlockPreview(block: Block | null) {
	if (!block) {
		return '';
	}

	switch (block.type) {
		case BlockType.TEXT:
			return block.text;
		case BlockType.IMAGE:
			return '🖼️';
		case BlockType.LINK:
			return `🔗 ${block.url.slice(0, 100)}`;
		case BlockType.MUSIC:
			return `🎧🎵`;
		default:
			return '';
	}
}
