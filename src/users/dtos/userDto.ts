import { IsEmail, IsNotEmpty } from "class-validator";
import { Role } from "src/role/role.enum";

export class UserDto {  
    
    @IsNotEmpty()  
    id: any;
    
    @IsNotEmpty()  
    @IsEmail()  
    email: string;

    @IsNotEmpty()
    role: Role;
}