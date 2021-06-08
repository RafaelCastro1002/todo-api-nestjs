import { TodoDto } from 'src/todos/dto/todo.dto';
import { CreateTodoDto } from './dto/todo.create.dto';
import { TodoService } from './todos.service';
import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TodoListDto } from './dto/todo.list.dto';
import { UserDto } from 'src/users/dtos/userDto';
import { Roles } from 'src/role/role.decorator';
import { Role } from 'src/role/role.enum';
import { RolesGuard } from 'src/role/roles.guard';
import { Response } from 'express';
import { User } from 'src/users/user.entity';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Todos')
@ApiBearerAuth()
@Controller('todos')
export class TodosController {

    constructor(private readonly todoService: TodoService) { }

    @Get('/')
    @Roles(Role.Admin)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @ApiQuery({ name: 'take', description: 'limit of documents on page', required: false })
    @ApiQuery({ name: 'skip', description: 'number of page', required: false })
    async findAll(@Query() query: object, @Req() req: any): Promise<any> {
        try {
            const todos = await this.todoService.findAll(query);
            return { ...todos };
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Get('/overdue-todos')
    @Roles(Role.Admin)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @ApiQuery({ name: 'take', description: 'limit of documents on page', required: false })
    @ApiQuery({ name: 'skip', description: 'number of page', required: false })
    async findAllOverdue(@Query() query: object, @Req() req: any): Promise<any> {
        try {
            const user: User = req.user;
            const todos = await this.todoService.findAllOverdue(query);
            return { ...todos };
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Get('/my-todos')
    @UseGuards(AuthGuard())
    async findMyTodos(@Req() req: any): Promise<TodoListDto> {
        try {
            const user = req.user;

            const todos = await this.todoService.findByIdUser(user);
            return { todos };
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Post('/my-todos/')
    @UseGuards(AuthGuard())
    async create(@Body() createTodoDto: CreateTodoDto, @Req() req: any): Promise<TodoDto> {
        const user = req.user as UserDto;

        return await this.todoService.createTodo(user, createTodoDto);
    }

    @Put('/my-todos/:id')
    @UseGuards(AuthGuard())
    async update(@Param('id') id: string, @Body() createTodoDto: CreateTodoDto, @Req() req: any) {
        try {
            const user = req.user as UserDto;

            return await this.todoService.updateTodo(user, id, createTodoDto);
        } catch (e) {
            let statusCode = e.status || HttpStatus.BAD_REQUEST
            return new HttpException(e.message, statusCode);
        }
    }

    @Put('/my-todos/completed/:id')
    @UseGuards(AuthGuard())
    async finishTodo(@Param('id') id: string, @Req() req: any) {
        try {
            const user = req.user as UserDto;
            return await this.todoService.finishTodo(user, id)
        } catch (e) {
            let statusCode = e.status || HttpStatus.BAD_REQUEST
            return new HttpException(e.message, statusCode);
        }
    }
}
