export class RobloxApiClientError extends Error {}

export class WebRequestError extends RobloxApiClientError {}

export class GenericRequestError extends RobloxApiClientError {}

export class RequestTooLargeError extends RobloxApiClientError {}