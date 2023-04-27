import { Injectable, Inject } from '@nestjs/common';
/**
 * MODEL
 */
import { Accounts } from '@/models/accounts.model';

@Injectable()
export class AppService {
  constructor(
    @Inject('ACCOUNTS_REPOSITORY')
    private accountsRepository: typeof Accounts,
  ) {}

  async findDupplicateAccountLogin({ email }) {
    const data = await this.accountsRepository.findOne<Accounts>({
      where: { email },
    });
    return data;
  }

  async updateAccountLogin(payload, id) {
    const data = await this.accountsRepository.update(payload, {
      where: { id },
    });
    return data;
  }

  async create(payload) {
    const data = await this.accountsRepository.create(payload);
    return data;
  }
}
