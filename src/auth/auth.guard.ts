import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from 'express';
import { jwtConstants } from "./constants";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private jwtService: JwtService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException('Access token not found');
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: jwtConstants.secret,
            });

            // Ensure the user ID property is consistent (from id_usuario to id)
            if (payload.id_usuario && !payload.id) {
                payload.id = payload.id_usuario;
            } else if (!payload.id && !payload.id_usuario) {
                console.error('JWT payload missing both id and id_usuario:', payload);
                throw new UnauthorizedException('Invalid user identity in token');
            }

            console.log('User authenticated:', {
                id: payload.id,
                email: payload.email,
                role: payload.role || payload.funcao
            });

            request['user'] = payload;
        } catch (error) {
            console.error('JWT verification error:', error);
            throw new UnauthorizedException('Invalid access token');
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const authorization = request.headers.authorization;
        if (!authorization) return undefined;

        const [type, token] = authorization.split(' ');
        return type === 'Bearer' ? token : undefined;
    }
}