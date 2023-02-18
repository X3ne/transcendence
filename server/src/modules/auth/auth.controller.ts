import {
  Controller,
  Body,
  Get,
  HttpStatus,
  Post,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { UserInput } from './dto/userInput.dto';
import { DoesUserExist } from '../../core/guards/doesUserExist.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(DoesUserExist)
  @Post('register')
  async register(@Body() userDto: UserInput) {
    return await this.authService.register(userDto);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() req) {
    return this.authService.login(req.user);
  }

  @Get('/42')
  @UseGuards(AuthGuard('42'))
  async loginWithProvider() {
    console.log('loginWithProvider');
  }

  @Get('/42/callback')
  @UseGuards(AuthGuard('42'))
  async fortyTwoAuthCallback(@Req() req, @Res() res: Response) {
    console.log(req.user);

    const isUserExist = await this.usersService.findOneByEmail(req.user.email);

    if (!isUserExist) {
      await this.authService.create(req.user);
    }

    const { token } = await this.authService.login(req.user);

    console.log('token', token);

    res.cookie('access_token', token, {
      maxAge: 2592000000,
      sameSite: true,
      secure: false,
    });

    res.status(HttpStatus.OK);
    return res.redirect(process.env.CLIENT_URL);
  }
}
