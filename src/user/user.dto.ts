import { ArgsType, Field, Int, ObjectType, PickType } from '@nestjs/graphql';

@ArgsType()
export class SignUpUserDto {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  password: string;
}

@ArgsType()
export class SignInUserDto {
  @Field()
  email: string;

  @Field()
  password: string;
}

@ArgsType()
export class UpdatePasswordDto {
  @Field(() => Int)
  id: number;

  @Field()
  password: string;

  @Field()
  newPassword: string;
}

@ArgsType()
export class UpdateUserDto extends PickType(UpdatePasswordDto, [
  'id',
  'password'
]) {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  email?: string;
}

@ObjectType()
export class User {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  email: string;
}
