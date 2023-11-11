import type { ImageType, ImageState, ThumbnailState } from './enums'

// utility types & such
/** A unique ID that identifies something on Roblox. */
export type Id = string | number

export type HttpMethod = 'GET' | 'HEAD' | 'OPTIONS' | 'POST' | 'PUT' | 'DELETE'

export interface RobloxApiError {
	error: unknown
}

export type ClientRequestResponse<T> = {
	data: T
	success: true
} | (RobloxApiError & { success: false })

// roblox api types
export interface BaseUserProfile {
	/** A unique ID that identifies the user. */
	userId: number
}

export interface UserProfile {
	names: {
		alias: string | null
		username: string
		contactName: string | null
		displayName: string
		combinedName: string
	}

	// unsure what this field is, it returns a 504 upon being requested.
	platformProfileId: unknown
}

export interface ApiGroupV2 {
	id: number
	name: string
	owner: Entity<'User'> | null
	created: string
	description: string
	hasVerifiedBadge: boolean
}

/** A mini-community within Roblox for communication, discussions, and more. */
export interface GroupV2 {
	/** A unique ID that identifies the group. */
	id: number

	/** The name of the group. Has a maximum limit of 50 characters. */
	display_name: string

	/** The group's owner, this can only be a User, and will be null if the group has no owner. */
	owner: Entity<'User'> | null

	/** The ISO 8601 timestamp when the group was created. */
	created_at: string

	/** The description of the group. */
	description: string

	/**
	 * Whether the group has the verified badge.
	 * 
	 * @see https://en.help.roblox.com/hc/en-us/articles/7997207259156-Verified-Badge-FAQ
	 */
	is_verified: boolean
}

export interface ApiPartialGroup {
	id: number
	name: string
	memberCount: number
	hasVerifiedBadge: boolean
}
export interface PartialGroup {
	/** A unique ID that identifies the group. */
	id: number

	/** The name of the group. Has a maximum limit of 50 characters. */
	display_name: string

	/** The total number of members within the group. */
	member_count: number

	/**
	 * Whether the group has the verified badge.
	 * 
	 * @see https://en.help.roblox.com/hc/en-us/articles/7997207259156-Verified-Badge-FAQ
	 */
	is_verified: boolean
}

/** A configurable property to grant specific privileges for members within a group. */
export interface GroupRole {
	/** A unique ID that identifies a role. */
	id: number

	/** The name of the role. Has a maximum limit of 100 characters. */
	name: string

	/**
	 * The rank of the role.
	 * 
	 * The minimum value is 0. The maximum value is 255.
	 */
	rank: number

	/** Total number of members within the role. */
	memberCount: number
}

/** Represents an entity on Roblox, such as a user, or group. */
export interface Entity<T extends 'User' | 'Group' = 'User' | 'Group'> {
	/** A unique ID that identifies the entity. */
	id: number
	type: T
}

/** @see https://thumbnails.roblox.com/docs */
export interface Thumbnail {
	state: ThumbnailState
	version: string
	imageUrl: string
	targetId: number
}

/**
 * An image on Roblox mapped from a {@link Thumbnail}.
 * 
 * When {@link Thumbnail.state} is not equal to {@link ThumbnailState.Completed}, the empty URL will be replaced with a Roblox-provided fallback image reflecting the state.
 * 
 * @see {@link Thumbnail}, {@link ImageType}, {@link ImageState}
 */
export type Image = {
	/** The URL of the image, usually originating from a sub-domain of rbxcdn.com. */
	url: string

	/** The type and origin of the image. */
	type: ImageType

	/**
	 * Current state of the image, reflecting that of {@link Thumbnail.state}.
	 * 
	 * @see {@link ThumbnailState}
	 */
	state: ImageState

	/** The requested width of the image. */
	width: number

	/** The requested height of the image. */
	height: number

	/** The unique identifier of the asset/entity this image originated from. */
	source_id: number
}

/** A common response returned by API endpoints. */
export interface DataList<T> {
	data: T[]
}