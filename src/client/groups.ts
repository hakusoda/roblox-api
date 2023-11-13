import { ImageType } from '../enums.ts';
import type RobloxApiClient from './index.ts';
import { GenericRequestError } from '../errors.ts';
import { mapThumbnailsToImages } from '../util.ts';
import type { Id, GroupV2, DataList, GroupRole, Thumbnail, ApiGroupV2, PartialGroup, ApiPartialGroup } from '../types.ts';

/**
 * A class containing methods for fetching user information.
 * 
 * @see https://groups.roblox.com/docs
 */
export default class ApiGroups {
	private client: RobloxApiClient;
	private baseUrl = 'https://groups.roblox.com';
	public constructor(client: RobloxApiClient) {
		this.client = client;
	}

	/**
	 * Returns a list of groups.
	 * 
	 * @param groupIds - The list of group IDs to retrieve information for.
	 * 
	 * @returns A list of GroupV2s.
	 * 
	 * @throws {GenericRequestError}
	 */
	public get(groupIds: Id[]): Promise<GroupV2[]> {
		if (!groupIds.length)
			return Promise.resolve([]);
		return this.request<DataList<ApiGroupV2>>(`v2/groups?groupIds=${[...new Set(groupIds)].join(',')}`)
			.then(response => {
				if (!response.success)
					throw new GenericRequestError();
				return response.data.data.map(group => ({
					id: group.id,
					owner: group.owner,
					created_at: group.created,
					description: group.description,
					display_name: group.name,
					is_verified: group.hasVerifiedBadge
				}));
			});
	}

	/**
	 * Returns a list of groups.
	 * 
	 * @param groupId - The unique identifier of the group to request roles for.
	 * 
	 * @returns A list of GroupRoles.
	 * 
	 * @throws {GenericRequestError}
	 */
	public getRoles(groupId: Id) {
		return this.request<{ roles: GroupRole[] }>(`v1/groups/${groupId}/roles`)
			.then(response => {
				if (!response.success)
					throw new GenericRequestError();
				return response.data.roles;
			});
	}

	/**
	 * Returns a list of group icons, historically known as emblems.
	 * 
	 * @param groupIds - The list of group IDs to retrieve images for.
	 * 
	 * @param size - The size of all images, defaults to 150x150
	 * 
	 * @returns A list of Images.
	 * 
	 * @throws {GenericRequestError}
	 */
	public getIcons(groupIds: Id[], size: 150 | 420 = 150) {
		if (!groupIds.length)
			return Promise.resolve([]);
		return this.client.request<DataList<Thumbnail>>(`https://thumbnails.roblox.com/v1/groups/icons?groupIds=${[...new Set(groupIds)].join(',')}&format=Png&size=${size}x${size}&circular=false`)
			.then(response => {
				if (!response.success)
					throw new GenericRequestError();
				return mapThumbnailsToImages(response.data.data, ImageType.GroupIcon, size);
			});
	}

	/**
	 * Looks up groups by a name. Prioritises an exact match as the first result.
	 * 
	 * @param query - The search query.
	 * 
	 * @returns A list of PartialGroups.
	 * 
	 * @throws {GenericRequestError}
	 */
	public searchExact(query: string): Promise<PartialGroup[]> {
		return this.request<DataList<ApiPartialGroup>>(`v1/groups/search/lookup?groupName=${query}`)
			.then(response => {
				if (!response.success)
					throw new GenericRequestError();
				return response.data.data.map(group => ({
					id: group.id,
					display_name: group.name,
					member_count: group.memberCount,
					is_verified: group.hasVerifiedBadge
				}));
			});
	}

	private request<T>(path: string | number) {
		return this.client.request<T>(`${this.baseUrl}/${path}`);
	}
}