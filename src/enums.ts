export enum ImageType {
	UserAvatarHeadshot,
	GroupIcon
}

export enum ImageState {
	Ready,
	Unknown
}

export enum ThumbnailState {
	Error = 'Error',
	Completed = 'Completed',
	InReview = 'InReview',
	Pending = 'Pending',
	Blocked = 'Blocked',
	TemporarilyUnavailable = 'TemporarilyUnavailable'
}