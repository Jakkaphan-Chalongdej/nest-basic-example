import { ApiProperty } from '@nestjs/swagger';
import { ENUMGender } from '../../../shared/enum/type.enum';

export class CreateUserDto {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty({ enum: ENUMGender })
  gender: ENUMGender;
}

export class GenerateUserDto {
  @ApiProperty({ example: 20 })
  users: number;
}
