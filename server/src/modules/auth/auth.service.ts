import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { UserInput } from './dto/userInput.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  public async login(user: UserInput) {
    const token = await this.generateToken(user);
    return { user, token };
  }

  public async create(user) {
    const newUser = await this.usersService.create({ ...user });

    const { password, ...result } = newUser['dataValues'];


    const token = await this.generateToken(result);

    return { user: result, token };
  }

  public async register(user: UserInput) {
    const hashedPassword = await this.hashPassword(user.password);
    console.log(hashedPassword);
    const createdUser = await this.usersService.create({
      ...user,
      password: hashedPassword,
    });
    const { password, ...result } = createdUser['dataValues'];

    const token = await this.generateToken(result);
    return { user: result, token };
  }

  private async generateToken(user: UserInput) {
    const token = await this.jwtService.signAsync(user);
    return token;
  }

  private async hashPassword(password: string) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }
}
