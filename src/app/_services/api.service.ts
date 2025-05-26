import { environment } from '../../environments/environment';

export const BASE_URL = `${environment.apiUrl}api/${environment.appVersion}`;
export const IS_PRODUCTION = environment.production;
