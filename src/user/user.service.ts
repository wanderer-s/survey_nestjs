import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { createHashedPassword } from './user.utill';
import { JwtService } from '@nestjs/jwt';
import * as process from 'process';

export type CreateUserParam = {
  name: string;
  email: string;
  password: string;
};

export type UpdateUserParam = {
  id: number;
  name?: string;
  email?: string;
  password: string;
  userId: number;
};

export type updatePasswordParam = {
  id: number;
  password: string;
  newPassword: string;
  userId: number;
};

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService
  ) {}

  async signUp(param: CreateUserParam): Promise<number> {
    const { password, ...restOfParam } = param;
    const hashedPassword = await createHashedPassword(password);
    const newUser = new UserEntity({
      ...restOfParam,
      password: hashedPassword
    });
    await this.userRepository.save(newUser);
    return newUser.id;
  }

  async findById(id: number) {
    const foundUser = await this.userRepository.findOneBy({ id });
    if (!foundUser) {
      throw new NotFoundException('user not found');
    }
    return foundUser;
  }

  async findByEmail(email: string) {
    const foundUser = await this.userRepository.findOneBy({ email });
    if (!foundUser) {
      throw new NotFoundException('user not found');
    }
    return foundUser;
  }

  async signIn(email: string, password: string) {
    const foundUser = await this.findByEmail(email);
    if (!(await foundUser.validatePassword(password))) {
      throw new UnauthorizedException();
    }
    const payload = {
      id: foundUser.id,
      email: foundUser.email
    };
    return await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_PERIOD
    });
  }

  async update(param: UpdateUserParam) {
    const { id, userId, ...restOfParam } = param;
    const foundUser = await this.findById(id);
    if (!(await foundUser.validatePassword(param.password))) {
      throw new BadRequestException();
    }
    if (foundUser.id !== userId) {
      throw new ForbiddenException();
    }
    foundUser.update(restOfParam);
    return await this.userRepository.save(foundUser);
  }

  async updatePassword(param: updatePasswordParam) {
    const { id, password, newPassword, userId } = param;
    const foundUser = await this.findById(id);
    if (!(await foundUser.validatePassword(password))) {
      throw new BadRequestException();
    }
    if (foundUser.id !== userId) {
      throw new ForbiddenException();
    }
    await foundUser.updatePassword(newPassword);
    await this.userRepository.save(foundUser);
  }
}
