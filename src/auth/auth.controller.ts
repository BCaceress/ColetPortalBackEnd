import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDTO, SignupDTO } from './dtos/auth';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('signup')
    async signup(@Body() body: SignupDTO) {
        return this.authService.signup(body);
    }

    @Post('signin')
    async signin(@Body() body: SigninDTO) {
        return this.authService.signin(body);
    }
    @UseGuards (AuthGuard)
    @Get('me')
    async me(@Request() request) {
        return request.user;
    }
}
