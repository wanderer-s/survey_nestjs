import { ArgsType, Field, Int, ObjectType } from '@nestjs/graphql';
import { RootEntity } from '../../global/root.entity';
import { Question } from './question.dto';
import { Paginated } from '../../global/pagination.model';
import { SurveyTemplateEntity } from '../entity/survey-template.entity';

@ArgsType()
export class CreateSurveyTemplateDto {
  @Field()
  title: string;

  @Field()
  description: string;
}

@ArgsType()
export class UpdateSurveyTemplateDto {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;
}
@ObjectType()
export class SurveyTemplate extends RootEntity {
  @Field()
  title: string;

  @Field()
  description: string;

  @Field(() => [Question])
  questions: Question[];
}

@ObjectType()
export class SurveyTemplateList extends Paginated(SurveyTemplate) {}
