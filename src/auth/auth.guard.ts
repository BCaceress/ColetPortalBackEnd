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

            request['user'] = payload;
        } catch {
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