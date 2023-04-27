import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Param,
  Res,
  Body,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
  ParseIntPipe,
  Query,
  Delete,
} from '@nestjs/common';
import {
  ApiBody,
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { FastifyReply } from 'fastify';

// import { JoiValidationPipe } from '../JoiValidationPipe.pipe';

// import { CREATE_SCHEMA } from './users.schema';

import { MSG } from '@/constants/err_msg/core.msg';

import { UsersService } from './users.service';

import { PaginationDto } from '../dto/requests/pagination.dto';
import { CreateDto } from './dto/requests/create.dto';
import { UpdateAgeDto } from './dto/requests/update-age.dto';
import { UsersDto } from './dto/responses/users.dto';

import { PAGINATION } from '@/constants/pagination';
import { SORT_BY_FIELD, ORDERBY } from '@/constants/sorting';

@ApiTags('users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ tags: ['Find all'] })
  @ApiOkResponse({ type: UsersDto })
  async findAll(@Res() res: FastifyReply, @Query() query: PaginationDto) {
    try {
      /** FILTER */
      const { page, pageLimit, sortBy, sort, search: SEARCH } = query;

      /** PAGINATION */
      const { STARTPAGE, PERPAGE } = PAGINATION(+page, +pageLimit);

      /** SORTING */
      const { SORT_BY, SORT } = ORDERBY(SORT_BY_FIELD, sortBy, sort);

      /** EXEC */
      const { rows, count } = await this.usersService.findAll({
        STARTPAGE,
        PERPAGE,
        SORT,
        SORT_BY,
        SEARCH,
      });

      /** RESPONSE */
      return res
        .header(
          'Content-Range',
          `${STARTPAGE + 1}-${
            (STARTPAGE + 1 - 1) * PERPAGE + PERPAGE
          }/${count}`,
        )
        .send(rows);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  @Get(':id')
  @ApiOkResponse({ type: UsersDto })
  async findOne(
    @Res() res: FastifyReply,
    @Param('id', new ParseIntPipe()) id: number,
  ) {
    try {
      /** IF NOT EXIST */
      const user = await this.usersService.findOne(id);
      if (!user) throw new NotFoundException('ไม่พบจ้า');

      return res.send(user);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  @Post()
  @ApiBody({ type: CreateDto })
  @ApiOkResponse({ type: UsersDto })
  //@UsePipes(new JoiValidationPipe(CREATE_SCHEMA))
  async create(
    @Res() res: FastifyReply,
    @Body() body: CreateDto, //ใช้แบบ class validator
    // @Body(new JoiValidationPipe(CREATE_SCHEMA)) body: CreateDto,
  ) {
    try {
      /** CREATE */
      const hasCreated = await this.usersService.create(body);

      return res.send(hasCreated);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  @Put(':id')
  @ApiBody({ type: CreateDto })
  @ApiOkResponse()
  async update(
    @Res() res: FastifyReply,
    @Param('id', new ParseIntPipe()) id: number,
    @Body() body: CreateDto,
  ) {
    try {
      // body.updatedBy = `${req.fullname}`;

      /** IF NOT EXIST */
      const hasUser = await this.usersService.findOne(id);
      if (!hasUser) throw new NotFoundException(MSG.NOT_FOUND_ACCOUNT);

      /** UPDATE */
      const hasUpdated = await this.usersService.update(body, id);
      if (!hasUpdated) throw new BadRequestException(MSG.INVALID_UPDATED);

      return res.send(hasUpdated);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Patch(':id')
  @ApiBody({ type: UpdateAgeDto })
  @ApiOkResponse()
  async updateAge(
    @Res() res: FastifyReply,
    @Param('id', new ParseIntPipe()) id: number,
    @Body() body: UpdateAgeDto,
  ) {
    try {
      // body.updatedBy = `${req.fullname}`;

      /** IF NOT EXIST */
      const hasUser = await this.usersService.findOne(id);
      if (!hasUser) throw new NotFoundException(MSG.NOT_FOUND_ACCOUNT);

      /** UPDATE */
      const hasUpdated = await this.usersService.updateAge(body, id);
      if (!hasUpdated) throw new BadRequestException(MSG.INVALID_UPDATED);

      return res.send(hasUpdated);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Delete(':id')
  @ApiOkResponse()
  async delete(
    @Res() res: FastifyReply,
    @Param('id', new ParseIntPipe()) id: number,
  ) {
    try {
      /** IF NOT EXIST */
      const hasUser = await this.usersService.findOne(id);
      if (!hasUser) throw new NotFoundException(MSG.NOT_FOUND_ACCOUNT);

      /** DELETE */
      const hasDelete = await this.usersService.delete(id);
      if (!hasDelete) throw new BadRequestException(MSG.INVALID_UPDATED);

      return res.send(hasDelete);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
