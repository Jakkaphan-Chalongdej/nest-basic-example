import { ApiProperty } from '@nestjs/swagger';
import { SearchQueryStringDto } from '@Shared/dto/paginationQueryString.dto';
import { Transform } from 'class-transformer';

export class QueryStringUserDto extends SearchQueryStringDto {
  @ApiProperty({ required: false, description: 'example: 2022-02-05' })
  startDate: string;

  @ApiProperty({ required: false, description: 'example: 2022-02-05' })
  endDate: string;
}
