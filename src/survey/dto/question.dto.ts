import { ArgsType, Field, Int, ObjectType } from '@nestjs/graphql';
import { RootEntity } from '../../global/root.entity';
import { Choice } from './choice.dto';

@ArgsType()
export class CreateQuestionDto {
  @Field(() => Int)
  surveyTemplateId: number;

  @Field()
  title: string;

  @Field(() => Int)
  sequence: number;
}

@ArgsType()
export class UpdateSequenceDto {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  sequence: number;
}

@ObjectType()
export class Question extends RootEntity {
  @Field()
  title: string;

  @Field(() => Int)
  sequence: number;

  @Field(() => [Choice])
  choices: Choice[];
}
