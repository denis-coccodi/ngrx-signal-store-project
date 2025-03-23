import {
  ConstantsBaseClinic,
  EnvironmentBaseConstants,
  EnvironmentBaseConstantsPIMS,
  EnvironmentName,
  SharedThirdPartyKeys,
} from '../environments.model';

const BASE_CONSTANTS: EnvironmentBaseConstants = {
  platform: 'web',
  version: '2.0.0',
  GOOGLE_MAPS_KEY: '',
};

export const CONSTANTS_PIMS: EnvironmentBaseConstantsPIMS = {
  ...BASE_CONSTANTS,
  CLOUDFLARE_ACCESS_CLIENT_ID: '',
  CLOUDFLARE_ACCESS_CLIENT_SECRET: '',
};

export const CONSTANTS_CLINIC: ConstantsBaseClinic = {
  ...BASE_CONSTANTS,
  x_service_code: '',
};

export const SHARED_ENVIRONMENT_KEYS: Record<
  EnvironmentName,
  SharedThirdPartyKeys
> = {
  localhost: {
    TOKBOX_API_KEY: '',
    STRIPE_API_KEY: '',
    serverless_api_url: '',
    serverless_api_key_tracking: '',
    serverless_api_key_no_auth_token: '',
  },
  dev: {
    TOKBOX_API_KEY: '',
    STRIPE_API_KEY: '',
    serverless_api_url: '',
    serverless_api_key_tracking: '',
    serverless_api_key_no_auth_token: '',
  },
  qa: {
    TOKBOX_API_KEY: '',
    STRIPE_API_KEY: '',
    serverless_api_url: '',
    serverless_api_key_tracking: '',
    serverless_api_key_no_auth_token: '',
  },
  staging: {
    TOKBOX_API_KEY: '',
    STRIPE_API_KEY: '',
    serverless_api_url: '',
    serverless_api_key_tracking: '',
    serverless_api_key_no_auth_token: '',
  },
  production: {
    TOKBOX_API_KEY: '',
    STRIPE_API_KEY: '',
    serverless_api_url: '',
    serverless_api_key_tracking: '',
    serverless_api_key_no_auth_token: '',
  },
} as const;
