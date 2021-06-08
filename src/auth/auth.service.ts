import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dtos/createUserDto';
import { LoginUserDto } from 'src/users/dtos/loginUserDto';
import { UserDto } from 'src/users/dtos/userDto';
import { UsersService } from 'src/users/users.service';
import { LoginStatus } from './interfaces/login-status.interface';
import { JwtPayload } from './interfaces/payload.interface';
import { RegistrationStatus } from './interfaces/regisration-status.interface';

@Injectable()
export class AuthService {

    constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) { }

    async register(userDto: CreateUserDto):
        Promise<RegistrationStatus> {
        let status: RegistrationStatus = {
            success: true,
            message: 'user registered',
        };
        try {
            await this.usersService.createUser(userDto);
        } catch (err) {
            status = {
                success: false,
                message: err,
            };
        }
        return status;
    }

    async registerAdmin(userDto: CreateUserDto):
        Promise<RegistrationStatus> {
        let status: RegistrationStatus = {
            success: true,
            message: 'admin registered',
        };
        try {
            await this.usersService.createAdmin(userDto);
        } catch (err) {
            status = {
                success: false,
                message: err,
            };
        }
        return status;
    }

    async login(loginUserDto: LoginUserDto): Promise<LoginStatus> {
        // find user in db    
        const user = await this.usersService.findByLogin(loginUserDto);

        // generate and sign token    
        const token = this._createToken(user);

        return {
            email: user.email, ...token,
        };
    }

    private _createToken({ email }: UserDto): any {
        try {
            const user: JwtPayload = { email };
            const accessToken = this.jwtService.sign(user);
            return {
                expiresIn: process.env.EXPIRESIN,
                accessToken,
            };
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
        }
    }

    async validateUser(payload: JwtPayload): Promise<UserDto> {
        const user = await this.usersService.findByPayload(payload);
        if (!user) {
            throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
        }
        return user;
    }

}
