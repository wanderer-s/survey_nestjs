import { Module } from '@nestjs/common';
import { SurveyTemplateService } from './service/survey-template.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurveyTemplateEntity } from './entity/survey-template.entity';
import { QuestionEntity } from './entity/question.entity';
import { ChoiceEntity } from './entity/choice.entity';
import { SurveyTemplateResolver } from './resolver/survey-template.resolver';
import { QuestionService } from './service/question.service';
import { QuestionResolver } from './resolver/question.resolver';
import { JwtService } from '@nestjs/jwt';
import { ChoiceService } from './service/choice.service';
import { ChoiceResolver } from './resolver/choice.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SurveyTemplateEntity,
      QuestionEntity,
      ChoiceEntity
    ])
  ],
  providers: [
    SurveyTemplateResolver,
    SurveyTemplateService,
    QuestionService,
    QuestionResolver,
    ChoiceService,
    ChoiceResolver,
    JwtService
  ],
  exports: [SurveyTemplateService]
})
export class SurveyModule {}
