export const SELECTED_E2E_ENV: 'dev' | 'qa' | 'staging' = 'staging';

export interface Settings {
	appErrorPrefix: string
	appTitle: string
	version: string
}

export interface EnvironmentBaseConstants {
	platform: string
	version: string
	GOOGLE_MAPS_KEY: string
}

export interface SharedThirdPartyKeys {
	TOKBOX_API_KEY: string | number;
	STRIPE_API_KEY: string;
	serverless_api_url: string;
	serverless_api_key_tracking: string;
	serverless_api_key_no_auth_token: string;
}

export interface ConstantsBaseClinic extends EnvironmentBaseConstants {
	x_service_code: string
}

export interface ConstantsClinic extends
	ConstantsBaseClinic,
	SharedThirdPartyKeys,
	EnvironmentBaseConstants
{
	env: string
	domain: string
	assets_url: string
	clinic_url: string
	brochure_url: string
	api_url: string
	partner_labs_url: string
	payment_url: string
	lemonaid_font: string
	boots_font: string
	ga_id: string
	google_maps: string
	zips_api_key: string
	addressnow_capture_key: string
}

export interface EnvironmentBaseConstantsPIMS extends EnvironmentBaseConstants {
	CLOUDFLARE_ACCESS_CLIENT_ID: string
	CLOUDFLARE_ACCESS_CLIENT_SECRET: string
}

export interface ConstantsPIMS extends
	EnvironmentBaseConstantsPIMS,
	SharedThirdPartyKeys,
	EnvironmentBaseConstants
{
	DOSESPOT_KEY: string
	DOSESPOT_SIGN_ON: string
	DOSESPOT_API: string
	DOSESPOT_CLINIC_ID: string
	TOKBOX_API_KEY: string | number
	STRIPE_API_KEY: string
	PRESCREENED_ENABLED: string
	ENV: string
	url?:string
	PIMS_FONTS: string
	CMS_API_URL: string
	API_URL: string
	ADMIN_API_URL: string
	CMS_URL: string
	serverless_tracking_api_url: string
	serverless_api_url: string
	serverless_api_key_tracking: string
	serverless_api_key_no_auth_token: string
}

export interface PIMSEnvironment {
	production: boolean
	settings: Settings
	constants: ConstantsPIMS
}

export interface ClinicEnvironment {
	production: boolean
	settings: Settings
	constants: ConstantsClinic
}

export type EnvironmentName = "localhost" | "dev" | "qa" | "staging" | "production";
