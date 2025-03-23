import { ConstantsClinic, ConstantsPIMS } from "../environments.model";
import { CONSTANTS_CLINIC, CONSTANTS_PIMS, SHARED_ENVIRONMENT_KEYS } from "./constants.base";

export const constantsLocalPIMS: ConstantsPIMS = {
  ...CONSTANTS_PIMS,
	...SHARED_ENVIRONMENT_KEYS.localhost,
	version: `${CONSTANTS_PIMS.version}-LOCAL`,
  TOKBOX_API_KEY: "",
  STRIPE_API_KEY: "",
  PRESCREENED_ENABLED: "",
  ENV: "",
  url: "",
  PIMS_FONTS: "",
  CMS_API_URL: "",
  ADMIN_API_URL: "",
  API_URL: "",
  CMS_URL: "",
	DOSESPOT_KEY: "",
	DOSESPOT_SIGN_ON: "",
	DOSESPOT_API: "",
	DOSESPOT_CLINIC_ID: "",
  serverless_tracking_api_url: "",
  serverless_api_url: "",
  serverless_api_key_no_auth_token: ""
}

export const constantsLocalClinic: ConstantsClinic = {
	...CONSTANTS_CLINIC,
	...SHARED_ENVIRONMENT_KEYS.localhost,
	env: "",
	platform: "",
	version: "",
	domain: "",
	assets_url: "",
	clinic_url: "",
	brochure_url: "",
	api_url: "",
	partner_labs_url: "",
	payment_url: "",
	lemonaid_font: "",
	boots_font: "",
	ga_id: "",
	google_maps: "",
	TOKBOX_API_KEY: 47810601,
	STRIPE_API_KEY: "",
	serverless_api_url:"",
	serverless_api_key_no_auth_token: "",
	zips_api_key: "",
	addressnow_capture_key: ""
}
