import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { SigninDTO, SignupDTO } from './dtos/auth';

@Injectable()
export class AuthService {
    constructor(private prismaService: PrismaService, private jwtService: JwtService) { }
    async signup(data: SignupDTO) {
        const UserAlreadyExists = await this.prismaService.user.findUnique({
            where: {
                email: data.email
            },
        });

        if (UserAlreadyExists) {
            throw new UnauthorizedException('User already exists');
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = await this.prismaService.user.create({
            data: {
                ...data,
                password: hashedPassword,
            }
        });

        return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
        };
    }

    async signin(data: SigninDTO) {
        const user = await this.prismaService.user.findUnique({
            where: {
                email: data.email
            },
        });
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const passwordMatches = await bcrypt.compare(data.password, user.password);

        if (!passwordMatches) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const accessToken = await this.jwtService.signAsync({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
        });
        return { accessToken };
    }
}
