import { comparePasswords } from './../shared/utils';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginUserDto } from 'src/users/dtos/loginUserDto';
import { UserDto } from 'src/users/dtos/userDto';
import { AdminDto } from 'src/users/dtos/adminDto';
import { toUserDto } from 'src/shared/mapper';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dtos/createUserDto';
import { Role } from 'src/role/role.enum';

@Injectable()
export class UsersService {

    constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) { }

    async findOne(options?: object): Promise<UserDto> {
        const user = await this.usersRepository.findOne(options);
        return toUserDto(user);
    }

    async findByLogin({ email, password }: LoginUserDto): Promise<UserDto> {
        const user = await this.usersRepository.findOne({ where: { email } });

        if (!user) {
            throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
        }

        // compare passwords    
        const areEqual = await comparePasswords(user.password, password);

        if (!areEqual) {
            throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
        }

        return toUserDto(user);
    }

    async findByPayload({ email }: any): Promise<UserDto> {
        return await this.findOne({
            where: { email }
        });
    }

    async createUser(userDto: CreateUserDto): Promise<UserDto> {    
        const { email, password } = userDto;
        
        // check if the user exists in the db    
        const userInDb = await this.usersRepository.findOne({ 
            where: { email } 
        });
        if (userInDb) {
            throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);    
        }
        
        const user: User = await this.usersRepository.create({ password, email, });
        await this.usersRepository.save(user);
        return toUserDto(user);  
    }

    async createAdmin(adminDto: CreateUserDto): Promise<AdminDto> {    
        const { password, email } = adminDto;
        const role = Role.Admin;
        // check if the user exists in the db    
        const userInDb = await this.usersRepository.findOne({ 
            where: { email } 
        });
        if (userInDb) {
            throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);    
        }
        
        const user: User = await this.usersRepository.create({ password, email, role });
        await this.usersRepository.save(user);
        return toUserDto(user);  
    }

}
