import { Users } from '@/models/users.model';

export const usersProviders = [
  { provide: 'USERS_REPOSITORY', useValue: Users },
];
