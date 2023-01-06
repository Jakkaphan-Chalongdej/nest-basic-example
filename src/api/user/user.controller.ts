import { SERIALIZE_GROUP } from '@Database/common/enum/serialization-group.enum';
import {
  Controller,
  UseInterceptors,
  ClassSerializerInterceptor,
  Post,
  SerializeOptions,
  Body,
  Get,
  Query,
  Param,
  ParseIntPipe,
  Patch,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto, GenerateUserDto } from './dto/create-user.dto';
import { QueryStringUserDto } from './dto/query-string-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @SerializeOptions({
    groups: [SERIALIZE_GROUP.GROUP_ALL_USER],
    strategy: 'excludeAll',
  })
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }

  @Post('generate')
  async generate(@Body() { users }: GenerateUserDto) {
    return await this.userService.generateUsers(users);
  }

  @Get()
  async findAll(@Query() qs: QueryStringUserDto) {
    return await this.userService.findAllUser(qs);
  }
  @Get('test')
  async test() {
    return await this.userService.test();
  }

  @Get(':id')
  @SerializeOptions({
    groups: [SERIALIZE_GROUP.GROUP_ALL_USER],
    strategy: 'excludeAll',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.findOneUser(id);
  }

  @Patch(':id')
  @SerializeOptions({
    groups: [SERIALIZE_GROUP.GROUP_ALL_USER],
    strategy: 'excludeAll',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @SerializeOptions({
    groups: [SERIALIZE_GROUP.GROUP_ALL_USER],
    strategy: 'excludeAll',
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.remove(id);
  }
}
