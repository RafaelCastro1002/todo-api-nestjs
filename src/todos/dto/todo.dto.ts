import { IsNotEmpty } from 'class-validator';
import { UserDto } from 'src/users/dtos/userDto';

export class TodoDto {
  
  id?: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  dueDate: Date;

  overdueTask?: Boolean;

  completed?: Boolean;
  createdOn?: string;

  finishedIn?: Date;

  ownerId?: any;

  userEmail?: any;

}
