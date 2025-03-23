import { Users } from '@types-lib';

export const defaultUser: Users.User = {
  id: 0,
  title: '',
  firstname: '',
  lastname: '',
  initials: '',
  email: '',
  password: '',
  dob: '',
  gender: '',
  security: {
    question: '',
    answer: '',
  },
  phones: [{ label: '', number: '' }],
  address: {
    id: 0,
    user_id: 0,
    road: '',
    city: '',
    state: '',
    zip: '',
  },
  roles: {},
};

export const USER_WITH_ROLES: Users.User = {
  id: 0,
  title: 'Dr.',
  firstname: 'Denis',
  lastname: 'Coccodi',
  gender: 'male',
  email: 'denis.coccodi@bootsdigitalhealth.co.uk',
  dob: '2000-05-06T00:00:00+00:00',
  initials: 'DC',
  credentials: 'GMC 123',
  roles: {
    '2': 'authenticated user',
    '4': 'doctor',
    '5': 'super',
    '6': 'system',
    '12': 'staff manager',
    '13': 'pharmacist',
    '15': 'doctor admin',
    '17': 'content admin',
    '20': 'clinic content admin',
  },
  security: {
    question: 'user',
    answer: 'Denis',
  },
  phones: [
    {
      label: 'cell',
      number: '09081123123',
    },
  ],
  address: {
    id: 81009,
    user_id: 64015,
    timestamps: {
      created: '2024-05-31T13:22:56+00:00',
      modified: '2024-07-24T15:31:39+00:00',
    },
    type: 'home',
    road: '26',
    city: 'Milan',
    state: 'IT',
    zip: '20125',
    default: false,
    status: false,
    user_selected: false,
    is_standardized: false,
  },
};

export const USER_WITH_NO_ROLES = {
  ...USER_WITH_ROLES,
  roles: {},
};
