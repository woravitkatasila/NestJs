import { Accounts } from '@/models/accounts.model';

export const accountsProviders = [
  { provide: 'ACCOUNTS_REPOSITORY', useValue: Accounts },
];
