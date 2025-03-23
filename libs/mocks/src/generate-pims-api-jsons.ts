import { workspaceRoot } from '@nrwl/devkit';
import axios, { AxiosResponse } from 'axios';
import fs from 'fs';
import path from 'path';
import { SELECTED_BASE_URL, SELECTED_CREDENTIALS } from './endpoints/endpoints.constants';
import {
	getEndpointsWithoutVariables,
	getEndpointsWithUrlVariables,
	getEndpointsWithUrlVariablesAndQueryParams,
	getNoVariablesEndpointsWithQueryParams,
} from './endpoints/get-endpoints';
import { postEndpointsWithUrlVariables } from './endpoints/post-endpoints';
import { generateCypressApiInterceptorsFile } from './generate-cy-interceptors';
import { Endpoint } from './mocks.model';

const loginUrl = `${SELECTED_BASE_URL}/v2.0/users/me/authenticate`;

const FgRed = '\x1b[31m';
const FgGreen = '\x1b[32m';
const FgYellow = '\x1b[33m';
const FgResetColor = '\x1b[0m';

const endpoints: Endpoint[] = [
	...getEndpointsWithoutVariables,
	...getNoVariablesEndpointsWithQueryParams,
	...getEndpointsWithUrlVariables,
	...getEndpointsWithUrlVariablesAndQueryParams,
	...postEndpointsWithUrlVariables,
].map((endpoint) => ({
	...endpoint,
	statusCode: endpoint.statusCode ?? 200,
	baseurl: endpoint.baseurl ?? SELECTED_BASE_URL,
	fileExtension: endpoint.fileExtension ?? 'json',
}));

// get credentials from the credentials file declared for e2e, and return a valid token
async function getToken() {
	const response = await axios.post(loginUrl, {
		username: SELECTED_CREDENTIALS.email,
		password: SELECTED_CREDENTIALS.password,
	});
	console.log('TOKEN: ', response.data.token);
	return response.data.token;
}

// call apis, and save their jsons in a properly formatted folder destination
async function fetchDataAndSave() {
	const token = await getToken();
	for (const endpoint of endpoints as Endpoint[]) {
		try {
			const destinationPath = path.join(
				workspaceRoot,
				getDestinationPath(endpoint)
			);
			if (fileExists(destinationPath)) {
				// skip this iteration
				continue;
			}
			const response = await fetchData(endpoint, token);
			if (!response || !response.data) {
				console.log(
					`${FgYellow}%s${FgResetColor}`,
					`[WARNING] Received undefined data from API: `,
					response && response.data
				);
			}

			writeFile(endpoint, response, destinationPath);
		} catch (error: any) {
			console.error(
				`${FgRed}%s${FgResetColor}`,
				`[ERROR] Failed to fetch and save for ${endpoint.baseurl}/${endpoint.url}:`,
				error.message
			);
			console.error(
				'Url Called:',
				`${endpoint.baseurl}/${getCleanedUpUrl(endpoint)}`
			);
		}
	}
}

function writeFile(
	endpoint: Endpoint,
	response: AxiosResponse<any, any>,
	destinationPath: string
) {
	if (endpoint.fileExtension?.toLowerCase() === 'json') {
		fs.writeFileSync(destinationPath, JSON.stringify(response.data, null, 2));
	} else {
		fs.writeFileSync(destinationPath, response.data);
	}

	console.log(
		`${FgGreen}%s${FgResetColor}`,
		`Saved data from ${endpoint.url} to ${destinationPath} `
	);
}

function getCleanedUpUrl(endpoint: Endpoint) {
	return endpoint.url.replace(/:[a-zA-Z0-9_]+=/g, '');
}

// call the api based on its method and return its response as promise
async function fetchData(endpoint: Endpoint, token: string) {
	const cleanedParamsUrl = getCleanedUpUrl(endpoint);
	switch (endpoint.method.toLowerCase()) {
		case 'post':
			return await axios.post(
				`${endpoint.baseurl}/${cleanedParamsUrl}`,
				endpoint.data,
				{
					headers: {
						...(endpoint.hideToken ? {} : { authorization: token }),
					},
				}
			);
		case 'put':
			return await axios.put(
				`${endpoint.baseurl}/${cleanedParamsUrl}`,
				endpoint.data,
				{
					headers: {
						...(endpoint.hideToken ? {} : { authorization: token }),
					},
				}
			);
		case 'delete':
			return await axios.delete(`${endpoint.baseurl}/${cleanedParamsUrl}`, {
				headers: {
					...(endpoint.hideToken ? {} : { authorization: token }),
				},
				...(endpoint.data ? { data: endpoint.data } : {}),
			});
		default:
			return await axios.get(`${endpoint.baseurl}/${cleanedParamsUrl}`, {
				headers: {
					...(endpoint.hideToken ? {} : { authorization: token }),
				},
			});
	}
}

// generate the file destination path automatically, based on the api url.
// The behavior can be overridden by adding the jsonPath property to the endpoint object
function getDestinationPath(endpoint: Endpoint) {
	const destinationPath = endpoint.jsonPath
		? `${endpoint.jsonPath}/${endpoint.method.toLowerCase()}-${
				endpoint.fileName
		  }.${endpoint.fileExtension}`
		: generateDestinationPath(endpoint);

	// full destination path from the root like c:\programs\...\libs\mocks\...
	// necessary as typescript was skewing relative paths
	const fullDestinationPath = path.join(workspaceRoot, destinationPath);

	// remove file name from the path
	const dir = path.dirname(fullDestinationPath);

	// creates file path if it doesn't exist
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}

	return destinationPath;
}

function fileExists(destinationPath: string) {
	if (fs.existsSync(destinationPath)) {
		console.log(
			`${FgYellow}%s${FgResetColor}`,
			`[WARNING] File already exists at ${destinationPath} and wasn't overwritten`
		);
		return true;
	}
	return false;
}

// create the destination path from the endpoint's url and file name
function generateDestinationPath(endpoint: Endpoint) {
	const queryParamlessUrl = endpoint.url.split('?')[0];
	// create visits/slugs/visitId from visits/:visitId=1234
	const pathWithReworkedNumericSlugs = queryParamlessUrl.replace(
		/:([a-zA-Z0-9_]+)=[^\/]+/g,
		'slugs/$1'
	);
	// extract all params values from the url (no query params)
	const paramsArray = [...queryParamlessUrl.matchAll(/=(\w+)(?=\/|$|\?)/g)].map(
		(match) => match[1]
	);

	const fullPath = `libs/mocks/src/lib/pims/api-services/${pathWithReworkedNumericSlugs}`;

	// join the params values in the file name ie: get-filename.1234.5678.json
	return `${fullPath}/${endpoint.method.toLowerCase()}-${endpoint.fileName}${
		paramsArray.length ? '.' : ''
	}${paramsArray.join('.')}.${endpoint.fileExtension}`;
}

async function main() {
	await fetchDataAndSave();
	generateCypressApiInterceptorsFile(endpoints, generateDestinationPath);
}

main();
