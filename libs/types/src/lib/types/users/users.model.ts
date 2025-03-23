export interface Role {
  ID: number;
  NAME: string;
}

export interface Roles {
  [key: string]: Role;
  MAILORDER_PROVIDER: { ID: number; NAME: string };
}

export interface User {
  id: number;
  title: string;
  firstname: string;
  lastname: string;
  initials: string;
  email: string;
  credentials?: string;
  password?: string;
  dob: string;
  gender: string;
  security: {
    question: string;
    answer: string;
  };
  phones: { label: string; number: string }[];
  address: {
    id: number;
    user_id: number;
    timestamps?: {
      created: string;
      modified: string;
    };
    type?: string;
    road?: string;
    city?: string;
    state?: string;
    zip?: string;
    default?: boolean;
    status?: boolean;
    user_selected?: boolean;
    is_standardized?: boolean;
  };
  roles: { [key: string]: string };
}

export interface StaffUser {
  id: number;
  title: string;
  firstname: string;
  lastname: string;
  initials: string;
  credentials: string;
  active: boolean;
  roles: { [key: string]: string };
  licenses?: License[];
}

interface License {
  id: number;
  state_code: string;
  license_number: number | string;
}

export interface LoggedInUserState {
  user?: User;
}

export interface AuthPostResponse {
  token: string;
}

export interface AuthPostRequest {
  username: string;
  password: string;
}

export const ROLES = {
  ANONYMOUS: { ID: 1, NAME: 'anonymous user' },
  AUTHENTICATED: { ID: 2, NAME: 'authenticated user' },
  BUSINESS: { ID: 3, NAME: 'business' },
  DOCTOR: { ID: 4, NAME: 'doctor' },
  SUPER: { ID: 5, NAME: 'super' },
  SYSTEM: { ID: 6, NAME: 'system' },
  WEB: { ID: 7, NAME: 'lemonaid web user' },
  LEMONAID_DASHBOARD_USER: { ID: 8, NAME: 'lemonaid dashboard user' },
  QA_USER: { ID: 9, NAME: 'qa user' },
  LAB_RESULTS_PROVIDER: { ID: 10, NAME: 'lab results provider' },
  MAILORDER_PROVIDER: { ID: 11, NAME: 'mailorder provider' },
  STAFF_MANAGER: { ID: 12, NAME: 'staff manager' },
  PHARMACIST: { ID: 13, NAME: 'pharmacist' },
  SUPERVISING_DOCTOR: { ID: 18, NAME: 'supervising doctor' },
  DOCTOR_ADMIN: { ID: 15, NAME: 'doctor admin' },
  BUSINESS_ADMIN: { ID: 16, NAME: 'business admin' },
  STORE_PORTAL_USER: { ID: 22, NAME: 'store portal user' },
};
