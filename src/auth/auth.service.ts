import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { SigninDTO, SignupDTO } from './dtos/auth';

@Injectable()
export class AuthService {
    constructor(private prismaService: PrismaService, private jwtService: JwtService) { }

    async signup(data: SignupDTO) {
        const userAlreadyExists = await this.prismaService.usuario.findUnique({
            where: {
                email: data.email
            },
        });

        if (userAlreadyExists) {
            throw new UnauthorizedException('User already exists');
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = await this.prismaService.usuario.create({
            data: {
                nome: data.name,
                email: data.email,
                senha: hashedPassword,
                funcao: data.role
            }
        });

        return {
            id_usuario: user.id_usuario,
            email: user.email,
            name: user.nome,
            role: user.funcao
        };
    }

    async signin(data: SigninDTO) {
        const user = await this.prismaService.usuario.findUnique({
            where: {
                email: data.email
            },
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const passwordMatches = await bcrypt.compare(data.password, user.senha);

        if (!passwordMatches) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Create a consistent user object for the JWT
        const userPayload = {
            id: user.id_usuario, // Use consistent property name
            id_usuario: user.id_usuario, // Keep original for backward compatibility
            email: user.email,
            name: user.nome,
            role: user.funcao
        };

        console.log('User authenticated successfully:', {
            id: user.id_usuario,
            email: user.email,
            role: user.funcao
        });

        const accessToken = await this.jwtService.signAsync(userPayload);

        return { accessToken };
    }
}
