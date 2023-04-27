import {
  Controller,
  Body,
  Post,
  Req,
  Res,
  HttpStatus,
  InternalServerErrorException,
  BadRequestException,
  UseInterceptors,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { AnyFilesFastifyInterceptor } from 'fastify-file-interceptor';
import {
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiOkResponse,
} from '@nestjs/swagger';
import { AppService } from './app.service';
import { UsersService } from './users/users.service';

import { MSG } from '@/constants/err_msg/core.msg';
import {
  uploadFiles,
  // genAccountCode,
  genPassword,
  verifyPassword,
  genTokenJWT,
  verifyTokenJWT,
} from '@/utils/app';
import { SignupDto } from './dto/requests/signup.dto';
import { SigninDto } from './dto/requests/signin.dto';
import { RefreshTokenDto } from './dto/requests/refreshToken.dto';
import { TokenDto } from './dto/responses/token.dto';

import { STATUS } from 'constants/status';

import { memoryStorage } from 'multer';
const storage = memoryStorage();

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly usersService: UsersService,
  ) {}

  @Post('signup')
  @ApiBody({ type: SignupDto })
  async create(@Res() res: FastifyReply, @Body() body: SignupDto) {
    try {
      /*** CREATE */
      const hasAccount = await this.appService.findDupplicateAccountLogin({
        email: body.email,
      });
      if (hasAccount) throw new BadRequestException(MSG.INVALID_CREATED);
      const { genSalt, genPasswd } = await genPassword(body.password);

      /*** GEN TOKEN */
      const accessToken = await genTokenJWT(body.email);
      const refreshToken = await genTokenJWT(body.email, false);

      const accountsPayload = {
        email: body.email,
        saltPassword: genSalt,
        password: genPasswd,
        accessToken,
        refreshToken,
        status: STATUS.ACTIVE,
      };
      //   body.accountCode = await genAccountCode();
      const created = await this.appService.create(accountsPayload);
      if (!created) throw new BadRequestException(MSG.INVALID_CREATED);

      const usersPayload = {
        user: body.user,
        accountId: created.id,
        age: body.age,
      };
      const user = await this.usersService.create(usersPayload);
      if (!user) throw new BadRequestException(MSG.INVALID_CREATED);

      return res.send({
        id: created.id,
        email: created.email,
        user: user.user,
        age: user.age,
        accessToken: created.accessToken,
        refreshToken: created.refreshToken,
        status: created.status,
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  @Post('signin')
  @ApiBody({ type: SigninDto })
  @ApiOkResponse({ type: TokenDto })
  async login(@Res() res: FastifyReply, @Body() body: SigninDto) {
    try {
      const hasAccount = await this.appService.findDupplicateAccountLogin({
        email: body.email,
      });
      if (!hasAccount) throw new BadRequestException(MSG.NOT_FOUND_ACCOUNT);
      const verify = await verifyPassword(body.password, hasAccount.password);
      if (!verify) throw new BadRequestException(MSG.INVALID_PASSOWRD);

      /*** GEN TOKEN */
      const accessToken = await genTokenJWT(body.email);
      const refreshToken = await genTokenJWT(body.email, false);
      // const payload = {
      //   accessToken,
      //   refreshToken,
      // };
      // await this.appService.updateAccountLogin(payload, hasAccount.id);
      return res.status(HttpStatus.OK).send({ accessToken, refreshToken });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  @Post('refresh-token')
  @ApiBody({ type: RefreshTokenDto })
  @ApiOkResponse({ type: TokenDto })
  async refreshToken(@Res() res: FastifyReply, @Body() body: RefreshTokenDto) {
    try {
      const authToken: any = await verifyTokenJWT(body.refreshToken, false);
      if (!authToken) throw new Error('TOKEN INVALID');
      /*** GEN TOKEN */
      const accessToken = await genTokenJWT(authToken.email);
      // const payload = {
      //   accessToken,
      // };
      // await this.appService.updateAccountLogin(payload, hasAccount.id);
      return res
        .status(HttpStatus.OK)
        .send({ accessToken, refreshToken: body.refreshToken });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  @Post('/upload')
  @ApiOperation({ summary: 'Upload File' })
  @ApiConsumes('multipart/form-data')
  // @ApiBody({
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       file: {
  //         type: 'string',
  //         format: 'binary',
  //       },
  //     },
  //   },
  // })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @UseInterceptors(AnyFilesFastifyInterceptor({ storage }))
  async upload(@Req() req: any, @Res() res: FastifyReply) {
    try {
      const files = req.files;
      if (!files || !Object.keys(files).length)
        throw new BadRequestException(MSG.FILE_NOT_FOUND);

      let result;
      if (files || Object.keys(files).length) {
        result = await uploadFiles('users', files);
      }
      return res.status(HttpStatus.OK).send(result);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }
}
