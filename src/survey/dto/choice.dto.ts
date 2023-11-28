import { ArgsType, Field, Int, ObjectType } from '@nestjs/graphql';
import { RootEntity } from '../../global/root.entity';

@ArgsType()
export class CreateChoiceDto {
  @Field(() => Int)
  questionId: number;

  @Field()
  name: string;

  @Field(() => Int)
  sequence: number;

  @Field(() => Int)
  point: number;
}

@ObjectType()
export class Choice extends RootEntity {
  @Field()
  name: string;

  @Field(() => Int)
  sequence: number;

  @Field(() => Int)
  point: number;
}
