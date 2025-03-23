export interface Endpoint {
	method: EndpointMethods;
	url: string;
	jsonPath?: string;
	interceptorRegex?: RegExp;
	statusCode?: number;
	baseurl?: string;
	data?: unknown;
	fileName: string;
	fileExtension?: string;
	hideToken?: boolean;
	additionalHeaders?: string;
	createCypressInterceptor?: boolean;
}

export enum EndpointMethods {
	GET = 'GET',
	POST = 'POST',
	PUT = 'PUT',
	DELETE = 'DELETE'
}
