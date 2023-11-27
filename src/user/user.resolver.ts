import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import {
  SignUpUserDto,
  UpdatePasswordDto,
  UpdateUserDto,
  User
} from './user.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUserId } from '../auth/auth.decorator';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => String, {
    description: '회원가입 성공 시 "success" 문구 반환'
  })
  async signUpUser(@Args() input: SignUpUserDto) {
    await this.userService.signUp(input);
    return 'success';
  }

  @Mutation(() => String, { description: 'token 반환' })
  async signInUser(
    @Args('email') email: string,
    @Args('password') password: string
  ) {
    return this.userService.signIn(email, password);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => User)
  async updateUser(
    @Args() input: UpdateUserDto,
    @CurrentUserId() userId: number
  ) {
    return await this.userService.update({ ...input, userId });
  }

  @UseGuards(AuthGuard)
  @Mutation(() => String, { description: '성공시 "success" 문구 반환' })
  async updatePassword(
    @Args() input: UpdatePasswordDto,
    @CurrentUserId() userId: number
  ) {
    await this.userService.updatePassword({
      ...input,
      userId
    });
    return 'success';
  }
}
