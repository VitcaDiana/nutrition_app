import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { emitWarning } from "process";

@Injectable()
export class AuthService{
    constructor(private jwtService: JwtService){}

    generateToken(user:any){
        return this.jwtService.sign({
            sub: user.id,
            email: user.email,
            role: user.role,
        });
    }
}