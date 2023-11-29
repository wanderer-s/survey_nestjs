import { Module } from '@nestjs/common';
import { ResponseService } from './service/response.service';
import { AnswerService } from './service/answer.service';
import { ResponseResolver } from './resolver/response.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponseEntity } from './entity/response.entity';
import { AnswerEntity } from './entity/answer.entity';
import { SurveyModule } from '../survey/survey.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ResponseEntity, AnswerEntity]),
    SurveyModule
  ],
  providers: [ResponseService, AnswerService, ResponseResolver]
})
export class ResponseModule {}
