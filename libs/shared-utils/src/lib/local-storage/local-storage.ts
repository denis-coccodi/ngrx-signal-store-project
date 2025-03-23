export enum LocalStorageKeys {
	SAVE_VISIT_PAGE_KEY = 'pagination_save_visits_table',
	SAVE_VISIT_FILTER_KEY = 'visit_order_filters',
	PIMS_PARAMETERS = 'pimsParameters'
}

export const getCachedValue = (key: LocalStorageKeys): any => {
	const value = localStorage.getItem(key);
	return value ? JSON.parse(value) : undefined;
}

export const setCachedValue = (key: LocalStorageKeys, value: any): void => {
	if(key && value) {
		localStorage.setItem(key, JSON.stringify(value));
	}
}

export const removeCachedValue = (key: LocalStorageKeys) => localStorage.removeItem(key);
