import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, IsOptional } from 'class-validator';

export class CreateTodoDto {

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(500)
  description?: string;

  @ApiProperty()
  @IsNotEmpty()
  dueDate: Date;
}
