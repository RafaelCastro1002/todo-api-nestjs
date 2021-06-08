import { Body, Controller, HttpException, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/role/role.decorator';
import { Role } from 'src/role/role.enum';
import { RolesGuard } from 'src/role/roles.guard';
import { CreateUserDto } from 'src/users/dtos/createUserDto';
import { LoginUserDto } from 'src/users/dtos/loginUserDto';
import { AuthService } from './auth.service';
import { LoginStatus } from './interfaces/login-status.interface';
import { RegistrationStatus } from './interfaces/regisration-status.interface';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Post('register')
    public async register(@Body() createUserDto: CreateUserDto,): Promise<RegistrationStatus> {
        const result: RegistrationStatus = await this.authService.register(createUserDto,);
        if (!result.success) {
            throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
        }
        return result;
    }

    @ApiBearerAuth()
    @Post('admin/register')
    @Roles(Role.Admin)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    public async registerAdmin(@Body() createUserDto: CreateUserDto,): Promise<RegistrationStatus> {
        const result: RegistrationStatus = await this.authService.registerAdmin(createUserDto,);
        if (!result.success) {
            throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
        }
        return result;
    }

    @Post('login')
    public async login(@Body() loginUserDto: LoginUserDto): Promise<LoginStatus> {
        return await this.authService.login(loginUserDto);
    }

}
