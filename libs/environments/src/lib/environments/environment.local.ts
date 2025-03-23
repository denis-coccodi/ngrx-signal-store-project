import {settings} from "./common/settings";
import {constantsLocalPIMS, constantsLocalClinic} from "./common/constants.local";
import {ClinicEnvironment, PIMSEnvironment} from "./environments.model";
import {InjectionToken} from "@angular/core";

export const environmentPIMS: PIMSEnvironment = {
	production: false,
	settings: {
		...settings
	},
	constants: {
		...constantsLocalPIMS
	}
};

export const environmentClinic: ClinicEnvironment = {
  production: false,
  settings: {
    ...settings
  },
  constants: {
    ...constantsLocalClinic
  }
};

export const PIMS_ENVIRONMENT = new InjectionToken<PIMSEnvironment>('PIMS_ENVIRONMENT');
export const CLINIC_ENVIRONMENT = new InjectionToken<ClinicEnvironment>('CLINIC_ENVIRONMENT');

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
