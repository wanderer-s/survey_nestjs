import { ArgsType, Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Answer } from './answer.dto';
import { Paginated } from '../../global/pagination.model';
import { ResponseStatus } from '../model/response-status.enum';
import { Pagination } from '../../global/types';

@ArgsType()
export class CreateResponseDto {
  @Field(() => Int)
  surveyTemplateId: number;
  @Field()
  respondentName: string;
  @Field({ nullable: true })
  respondentEmail?: string;
  @Field({ nullable: true })
  respondentMobile?: string;
}

@ArgsType()
export class CreateAnswerDto {
  @Field(() => Int)
  surveyTemplateId: number;

  @Field(() => Int)
  responseId: number;

  @Field(() => Int)
  questionId: number;

  @Field(() => Int)
  choiceId: number;
}

@InputType()
export class findAllResponseFilter {
  @Field(() => ResponseStatus, { nullable: true })
  status: ResponseStatus;
}

@ObjectType()
class Respondent {
  @Field()
  name: string;
  @Field({ nullable: true })
  email?: string;
  @Field({ nullable: true })
  mobile?: string;
}

@ObjectType()
export class Response {
  @Field(() => Int)
  id: number;
  @Field()
  surveyTitle: string;
  @Field()
  surveyDescription: string;
  @Field(() => Respondent)
  respondent: Respondent;
  @Field(() => [Answer])
  answers: Answer[];
  @Field()
  createdAt: Date;
  @Field({ nullable: true })
  updatedAt?: Date;
}

@ObjectType()
export class ResponseList extends Paginated(Response) {}
