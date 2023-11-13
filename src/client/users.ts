import type { DeepPick, DeepPickPath } from 'ts-deep-pick';
interface DeepPickGrammar {
	prop: '.'
	glob: never
	omit: never
    array: never
    mutate: never
}

import { ImageType } from '../enums';
import type RobloxApiClient from './index';
import { GenericRequestError } from '../errors';
import { mapThumbnailsToImages } from '../util';
import type { Id, DataList, Thumbnail, UserProfile, BaseUserProfile } from '../types';

/** A class containing methods for fetching user information. */
export default class ApiUsers {
	private client: RobloxApiClient;
	public constructor(client: RobloxApiClient) {
		this.client = client;
	}

	/**
	 * Returns a list of user profiles containing the requested fields.
	 * @experimental This uses an undocumented endpoint that could change at any time without warning.
	 * 
	 * @param userIds - The list of user IDs to retrieve information for.
	 * 
	 * @param fields - The list of fields to retrieve.
	 * 
	 * @returns A list of UserProfiles based on the requested fields.
	 * 
	 * @throws {GenericRequestError}
	 */
	public getProfiles<T extends DeepPickPath<UserProfile, DeepPickGrammar>[]>(userIds: Id[], fields: T) {
		if (!userIds.length)
			return Promise.resolve([]);
		return this.client.request<{ profileDetails: (BaseUserProfile & DeepPick<UserProfile, T[number]>)[] }>('user-profile-api/v1/user/profiles/get-profiles', 'POST', {
			fields: [...new Set(fields)],
			userIds: [...new Set(userIds)]
		})
			.then(response => {
				if (!response.success)
					throw new GenericRequestError();
				return response.data.profileDetails;
			});
	}

	/**
	 * Returns a list of user avatar headshots.
	 * 
	 * @param userIds - The list of user IDs to retrieve images for.
	 * 
	 * @param size - The size of all images, defaults to 150x150.
	 * 
	 * @returns A list of Images.
	 * 
	 * @throws {GenericRequestError}
	 */
	public getAvatarHeadshots(userIds: Id[], size: 48 | 50 | 60 | 75 | 100 | 110 | 150 | 180 | 352 | 420 | 720 = 150) {
		if (!userIds.length)
			return Promise.resolve([]);
		return this.client.request<DataList<Thumbnail>>(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${[...new Set(userIds)].join(',')}&format=Png&size=${size}x${size}&circular=false`)
			.then(response => {
				if (!response.success)
					throw new GenericRequestError();
				return mapThumbnailsToImages(response.data.data, ImageType.UserAvatarHeadshot, size);
			});
	}
}