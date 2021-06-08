import { TodoDto } from "src/todos/dto/todo.dto";
import { UserDto } from "src/users/dtos/userDto";
import { User } from "src/users/user.entity";
import { Todo } from 'src/todos/todo.entity';

export const toTodoDto = (data: Todo): TodoDto => {
    const { id, description, dueDate, completed, createdOn, owner, finishedIn, updatedAt } = data;

    let todoDto: TodoDto = {
        id,
        description,
        dueDate,
        completed,
        createdOn,
        ownerId: owner ? toIdUserDto(owner) : null,
    };

    todoDto = isCompleted(finishedIn, todoDto);    
    todoDto = isUpdate(updatedAt, todoDto);
    todoDto.overdueTask = todoDto.dueDate < new Date();

    return todoDto;
};

export const toTodoDtoLessDetais = (data: Todo): TodoDto => {
    const { description, dueDate, owner} = data;

    let todoDto: TodoDto = {
        description,
        dueDate,
        userEmail: owner ? toEmailUserDto(owner) : null,
    };

    return todoDto;
};

const isUpdate = (updatedAt, todoDto) => {
    if(updatedAt) todoDto.updatedAt = updatedAt;

    return todoDto;
}

const isCompleted = (finishedIn, todoDto) => {
    if(finishedIn) todoDto.finishedIn = finishedIn;

    return todoDto;
}

export const toIdUserDto = (data: User): any => {
    const { id } = data;
    let userId: any = id;
    return userId;
};

export const toEmailUserDto = (data: User): any => {
    const { email } = data;
    let userEmail: any = email;
    return userEmail;
};

export const toUserDto = (data: User): UserDto => {
    const { id, email, role } = data;
    let userDto: UserDto = { id, email, role };
    return userDto;
};
