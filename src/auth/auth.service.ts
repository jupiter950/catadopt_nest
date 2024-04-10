import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { CreateUserDto, UserRole } from '../users/dto/create-user.dto';
import { PasswordService } from './password.service';


@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private passwordService: PasswordService
  ) { }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = (await this.usersService.findAll()).find(user => user.email === email);
    if (user && user.password === password) {
      return user;
    }
    return null;
  }

  async signIn(
    email: string,
    password: string
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findByEmail(email);

    if (user && bcrypt.compare(password, user.password)) {
      const payload = {
        userId: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      };

      return {
        access_token: await this.jwtService.signAsync(payload)
      };
    } else {
      throw new UnauthorizedException();
    }


  }



  async signUp(
    email: string,
    firstName: string,
    lastName: string,
    password: string
  ): Promise<User> {
    const createUserDto: CreateUserDto = {
      email,
      firstName,
      lastName,
      password: await bcrypt.hash(password, 10),
      role: UserRole.User
    };

    try {
      const res = await this.usersService.create(createUserDto);
      return res;
    } catch (error) {
      Logger.error(error);
      throw new UnauthorizedException();
    }
  }
}
