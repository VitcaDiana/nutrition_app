import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from '../../prisma/generated/prisma/enums.js';
import { ROLES_KEY } from "./roles.decorator.js";




@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY,[
            context.getHandler(),
            context.getClass(),
        ]);
        if(!requiredRoles) return true;

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        return requiredRoles.includes(user.role);


    }
        
    }
