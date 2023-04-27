import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { usersProviders } from './users.providers';
import { accountsProviders } from '../app.providers';
import { Authentication } from '@/middlewares/authentication.middleware';
import { DatabaseModule } from '@/databases/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [UsersService, ...usersProviders, ...accountsProviders],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(Authentication).forRoutes(UsersController);
  }
}
