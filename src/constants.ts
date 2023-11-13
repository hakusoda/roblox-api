import { ThumbnailState } from './enums.ts';

export const THUMBNAIL_FALLBACK: Record<ThumbnailState, string> = {
	[ThumbnailState.Error]: 'https://t0.rbxcdn.com/bf5841143a43ff8b754b7026159a2a18', // incorrect, should be "torn paper" variant
	[ThumbnailState.Blocked]: 'https://t3.rbxcdn.com/9fc30fe577bf95e045c9a3d4abaca05d',
	[ThumbnailState.Pending]: 'https://t0.rbxcdn.com/bf5841143a43ff8b754b7026159a2a18', // incorrect
	[ThumbnailState.InReview]: 'https://t0.rbxcdn.com/bf5841143a43ff8b754b7026159a2a18', // incorrect
	[ThumbnailState.Completed]: 'https://t0.rbxcdn.com/bf5841143a43ff8b754b7026159a2a18',
	[ThumbnailState.TemporarilyUnavailable]: 'https://t0.rbxcdn.com/bf5841143a43ff8b754b7026159a2a18'
};