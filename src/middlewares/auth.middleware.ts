import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from '@nestjs/common';
import axios from 'axios';
import {Request} from 'express';
    
@Injectable()
export class AuthGuard implements CanActivate {
    url = 'http://localhost:3000/users/can-do';

    constructor(private permissionId: number) {}
        
    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const request: Request = context.switchToHttp().getRequest();
            const token = request.headers.authorization;
            if (token == null) {
                throw new UnauthorizedException('El token no existe');
            }
            return await axios.get(`${this.url}/${this.permissionId}`, {headers: {Authorization: token}});
        } catch (error) {
            throw new UnauthorizedException(error?.message)
        }
    }
}