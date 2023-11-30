import { ArgsType, Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { RootEntity } from '../../global/root.entity';
import { Question } from './question.dto';
import { Paginated } from '../../global/pagination.model';

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

@InputType()
export class findAllSurveyTemplateFilter {
  @Field({nullable: true, description: '제목에로 포함되어 있는 설문지 조회'})
  title: string;
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
