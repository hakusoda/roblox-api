import ApiUsers from './users';
import ApiGroups from './groups';
import ApiExperiences from './experiences';
import { WebRequestError } from '../errors';
import type { HttpMethod, ClientRequestResponse } from '../types';
export default class RobloxApiClient {
	/**
	 * A reference to the ApiUsers class.
	 * 
	 * @see {@link ApiUsers}
	 */
	public users: ApiUsers;

	/**
	 * A reference to the ApiGroups class.
	 * 
	 * @see {@link ApiGroups}
	 */
	public groups: ApiGroups;

	/**
	 * A reference to the ApiExperiences class.
	 * 
	 * @see {@link ApiExperiences}
	 */
	public experiences: ApiExperiences;

	/** The base url used for most **modern** endpoints. */
	public baseUrl = 'https://apis.roblox.com';
	public constructor() {
		this.users = new ApiUsers(this);
		this.groups = new ApiGroups(this);
		this.experiences = new ApiExperiences(this);
	}

	public async request<T>(path: string, method: HttpMethod = 'GET', payload?: any, headers?: Record<string, string>): Promise<ClientRequestResponse<T>> {
		const isJson = !!payload && (Object.getPrototypeOf(payload).constructor === Object || Array.isArray(payload));
		return fetch(path.startsWith('http') ? path : `${this.baseUrl}/${path}`, {
			body: isJson ? JSON.stringify(payload) : payload,
			method,
			headers: {
				accept: 'application/json',
				'content-type': isJson ? 'application/json' : 'text/plain',
				...headers
			}
		})
			.then(response => {
				if (response.headers.get('content-type')?.includes('application/json'))
					return response.json()
						.catch(error => {
							throw new WebRequestError(error.message, { cause: error });
						});
				return response.text();
			})
			.then(data => {
				if (typeof data !== 'string' && data.error)
					return { ...data, success: false };
				return { data, success: true };
			});
	}
}