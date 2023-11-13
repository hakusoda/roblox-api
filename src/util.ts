import { THUMBNAIL_FALLBACK } from './constants.ts';
import type { Image, Thumbnail } from './types.ts';
import { ImageType, ImageState, ThumbnailState } from './enums.ts';
export function mapThumbnailsToImages(thumbnails: Thumbnail[], type: ImageType, size: number): Image[] {
	return thumbnails.map(thumbnail => ({
		url: thumbnail.imageUrl || THUMBNAIL_FALLBACK[thumbnail.state],
		type,
		state: thumbnail.state === ThumbnailState.Completed ? ImageState.Ready : ImageState.Unknown,
		width: size,
		height: size,
		source_id: thumbnail.targetId
	}));
}