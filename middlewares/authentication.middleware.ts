import {
  Injectable,
  Inject,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

/**
 * CONSTANTS | UTILS
 */
import { verifyTokenJWT } from '@/utils/app';
import { Accounts } from '@/models/accounts.model';

// import { UserModel } from '@src/user/user.model';
import * as dotenv from 'dotenv';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

@Injectable()
export class Authentication implements NestMiddleware {
  constructor(
    @Inject('ACCOUNTS_REPOSITORY')
    private accountsRepository: typeof Accounts,
  ) {}

  async use(req: any, res: any, next: any) {
    try {
      const authHeaders = req.headers.authorization;
      if (authHeaders && (authHeaders as string).split(' ')[1]) {
        const token = (authHeaders as string).split(' ')[1];

        const authToken: any = await verifyTokenJWT(token);
        if (!authToken) throw new Error('TOKEN INVALID');

        // const data = await this.accountsRepository.findOne<Accounts>({
        //   where: {
        //     [Op.and]: [{ email: authToken.email, accessToken: token }],
        //   },
        // });
        // if (!data) throw new Error('TOKEN INVALID');
        return next();
      } else {
        throw new Error('UNAUTHORIZED');
      }
    } catch (error) {
      if (error.message == 'FORBIDEN')
        return next(new HttpException(error.message, HttpStatus.FORBIDDEN));
      return next(new HttpException(error.message, HttpStatus.UNAUTHORIZED));
    }
  }
}
