import { TodosController } from './todos.controller';
import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { TodoService } from './todos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './todo.entity';
import { User } from 'src/users/user.entity';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/role/roles.guard';

@Module({
    imports: [
        UsersModule,
        AuthModule,
        TypeOrmModule.forFeature([Todo, User])
    ],
    controllers: [TodosController,],
    providers: [
        TodoService,
    ],
})
export class TodosModule { }
