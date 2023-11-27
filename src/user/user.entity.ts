import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn
} from 'typeorm';
import { CreateUserParam } from './user.service';
import { createHashedPassword, validateHashedPassword } from './user.utill';
import { BadRequestException } from '@nestjs/common';

type UpdateUserParam = {
  name?: string;
  email?: string;
};

@Entity('user')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  constructor(param?: CreateUserParam) {
    super();
    if (param) {
      this.name = param.name;
      this.email = param.email;
      this.password = param.password;
    }
  }
  validatePassword(password: string): Promise<boolean> {
    return validateHashedPassword(password, this.password);
  }

  async updatePassword(newPassword: string) {
    if (await this.validatePassword(newPassword)) {
      throw new BadRequestException('기존 password와 같습니다');
    }

    this.password = await createHashedPassword(newPassword);
  }

  update(param: UpdateUserParam) {
    const { name, email } = param;
    if (name) {
      this.name = name;
    }

    if (email) {
      this.email = email;
    }
  }
}
