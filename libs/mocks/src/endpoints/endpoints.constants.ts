import { pimsCredentials } from '../credentials';

export const DEV_BASE_URL = 'https://dev-api-pims.lemonaidpims.co.uk:2053';
export const DEV_V1_BASE_URL = 'https://dev-sapi.lemonaidpims.co.uk';
export const DEV_DOMAIN = 'https://dev.lemonaidpims.co.uk';

export const STAGING_BASE_URL =
	'https://staging-api-pims.lemonaidpims.co.uk:2053';
export const STAGING_V1_BASE_URL = 'https://staging-sapi.lemonaidpims.co.uk';
export const STAGING_DOMAIN = 'https://staging.lemonaidpims.co.uk';

export const SELECTED_BASE_URL = STAGING_BASE_URL;
export const SELECTED_V1_BASE_URL = STAGING_V1_BASE_URL;
export const SELECTED_DOMAIN = STAGING_DOMAIN;

export const SELECTED_CREDENTIALS = pimsCredentials.staging;

// URL IDs
export const batchStatusOrderId = ':orderId=22401';
export const stateId = ':stateId=UK';
export const categoryId = ':categoryId=37'; // WEI-F
export const questionnaireId = ':questionnaireId=484';
export const staffUserId = ':staffUserId=37449';
export const clientUserId = ':clientUserId=35954';
export const orderId = ':orderId=22405';

// Query Params IDs
export const categoryCodeQueryParamValue = 'WEI-F';
export const clientUserIdQueryParam = '35954';
