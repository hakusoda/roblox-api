import type RobloxApiClient from './index';
import { GenericRequestError, RequestTooLargeError } from '../errors';
import type { Id, DataList, Universe, ApiUniverse } from '../types';

/**
 * A class containing methods for fetching experience information.
 * 
 * @see https://games.roblox.com/docs
 */
export default class ApiExperiences {
	private client: RobloxApiClient;
	private baseUrl = 'https://games.roblox.com';
	public constructor(client: RobloxApiClient) {
		this.client = client;
	}

	/**
	 * Returns a list of experiences (universes).
	 * 
	 * @param experienceIds - The list of experience IDs to retrieve information for, maximum 100.
	 * 
	 * @returns A list of {@link Universe}.
	 * 
	 * @throws {GenericRequestError}
	 * Thrown if an error occurs during the request.
	 * 
	 * @throws {RequestTooLargeError}
	 * Thrown if `experienceIds` exceeds a length of 100 (one hundred).
	 */
	public get(experienceIds: Id[]): Promise<Universe[]> {
		if (!experienceIds.length)
			return Promise.resolve([]);
		if (experienceIds.length > 100)
			throw new RequestTooLargeError('experienceIds exceeded 100 items, this is an API limitation!');
		return this.request<DataList<ApiUniverse>>(`v1/games?universeIds=${[...new Set(experienceIds)].join(',')}`)
			.then(response => {
				if (!response.success)
					throw new GenericRequestError();
				return response.data.data.map(universe => ({
					id: universe.id,
					name: universe.sourceName,
					genre: universe.genre,
					owner: universe.creator,
					created_at: universe.created,
					updated_at: universe.updated,
					visit_count: universe.visits,
					is_copyable: universe.copyingAllowed,
					description: universe.sourceDescription,
					display_name: universe.name,
					player_count: universe.playing,
					is_all_genres: universe.isAllGenre,
					root_place_id: universe.rootPlaceId,
					is_favourited: universe.isFavoritedByUser,
					user_entry_price: universe.price,
					is_genre_enforced: universe.isGenreEnforced,
					display_description: universe.description,
					allowed_gear_genres: universe.allowedGearGenres,
					user_favourite_count: universe.favoritedCount,
					max_server_player_count: universe.maxPlayers,
					allowed_gear_categories: universe.allowedGearCategories,
					private_servers_enabled: universe.createVipServersAllowed,
					is_apis_enabled_in_studio: universe.studioAccessToApisAllowed
				} satisfies Universe));
			});
	}

	private request<T>(path: string | number) {
		return this.client.request<T>(`${this.baseUrl}/${path}`);
	}
}