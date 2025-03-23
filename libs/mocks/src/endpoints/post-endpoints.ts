import { Endpoint, EndpointMethods } from '../mocks.model.js';
import { orderId } from './endpoints.constants.js';

export const postEndpointsWithUrlVariables: Endpoint[] = [
	{
		method: EndpointMethods.POST,
		url: `v2.0/admin/orders/${orderId}/locks`,
		fileName: `order-locks`,
		createCypressInterceptor: true,
	},
];
