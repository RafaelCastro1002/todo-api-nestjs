import { CreateTodoDto } from './dto/todo.create.dto';
import { toTodoDto, toTodoDtoLessDetais } from './../shared/mapper';
import { TodoDto } from 'src/todos/dto/todo.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, MoreThanOrEqual, Repository } from 'typeorm';
import { Todo } from './todo.entity';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/user.entity';

@Injectable()
export class TodoService {

    constructor(@InjectRepository(Todo)
    private readonly todo: Repository<Todo>,
        private readonly usersService: UsersService
    ) { }

    async findAll(query: object = {}): Promise<any> {

        const [todosDb, total] = await this.todo.findAndCount({
            relations: ['owner'],
            ...query
        });

        const todos = todosDb.map(todo => toTodoDtoLessDetais(todo));

        return { todos, total };
    }

    async findAllOverdue(query: object = {}): Promise<any> {

        const [todosDb, total] = await this.todo.findAndCount({
            relations: ['owner'],
            where: { dueDate: LessThan(new Date) },
            ...query,
        });

        const todos = todosDb.map(todo => toTodoDtoLessDetais(todo));

        return { todos, total };
    }

    async findByIdUser(user: User): Promise<TodoDto[]> {
        const todos = await this.todo.find({
            where: { owner: user },
            relations: ['owner']
        });
        return todos.map(todo => toTodoDto(todo));
    }

    async createTodo({ email }, createTodoDto: CreateTodoDto): Promise<TodoDto> {
        const { description, dueDate } = createTodoDto;

        // get the user from db
        const owner = await this.usersService.findOne({ where: { email } });

        let todo: Todo = await this.todo.create({
            description,
            dueDate,
            owner
        });

        await this.todo.save(todo);

        return toTodoDto(todo);
    }

    async updateTodo({ email }, id: string, createTodoDto: CreateTodoDto): Promise<TodoDto> {
        const { description, dueDate } = createTodoDto;

        // get the user from db
        const owner = await this.usersService.findOne({ where: { email } });

        let todoDatabase: Todo = await this.todo.findOne({
            where: { id, owner },
            relations: ['owner']
        });

        if (!todoDatabase) throw new HttpException('Todo não encontrado.', HttpStatus.BAD_REQUEST);
        if (todoDatabase.completed) throw new HttpException('Todo finalizado não pode ser alterado.', HttpStatus.NOT_MODIFIED);

        let todoEdit = todoDatabase;
        todoEdit.description = description || todoEdit.description;
        todoEdit.dueDate = dueDate || todoEdit.dueDate;

        await this.todo.update({ id }, todoEdit);
        return toTodoDto(todoEdit);
    }

    async finishTodo({ email }, id: string): Promise<TodoDto> {

        // get the user from db
        const owner = await this.usersService.findOne({ where: { email } });

        let todo: Todo = await this.todo.findOne({
            where: { id, owner },
            relations: ['owner']
        });

        if (!todo) throw new HttpException('Todo não encontrado.', HttpStatus.BAD_REQUEST);

        if (todo.completed) throw new HttpException('Todo já finalizado.', HttpStatus.NOT_MODIFIED);

        todo.completed = true;
        await this.todo.update({ id }, todo);
        return toTodoDto(todo);
    }
}
