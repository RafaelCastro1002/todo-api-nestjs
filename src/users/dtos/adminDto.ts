import { IsEmail, IsNotEmpty } from "class-validator";

export class AdminDto {  
    
    @IsNotEmpty()  
    id: any;
    
    @IsNotEmpty()  
    @IsEmail()  
    email: string;

}