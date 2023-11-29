import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Answer {
  @Field(() => Int)
  id: number;

  @Field()
  questionTitle: string;

  @Field()
  choiceName: string;

  @Field()
  choicePoint: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
};