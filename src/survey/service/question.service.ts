import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { QuestionEntity } from '../entity/question.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SurveyTemplateEntity } from '../entity/survey-template.entity';

type createQuestionParam = {
  surveyTemplateEntity: SurveyTemplateEntity;
  title: string;
  sequence: number;
  userId: number;
};

type updateSequenceParam = {
  id: number;
  sequence: number;
  userId: number;
};

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(QuestionEntity)
    private readonly questionRepository: Repository<QuestionEntity>
  ) {}

  async create(param: createQuestionParam) {
    const newQuestion = new QuestionEntity(param);
    await this.questionRepository.save(newQuestion);
    return newQuestion;
  }

  async findBySurveyTemplateId(surveyTemplateId: number) {
    return await this.questionRepository
      .createQueryBuilder('question')
      .where('question.surveyTemplate.id = :id', { id: surveyTemplateId })
      .orderBy('question.sequence', 'ASC')
      .getMany();
  }

  async findById(id: number) {
    const foundQuestion = await this.questionRepository.findOneBy({ id });
    if (!foundQuestion) {
      throw new NotFoundException();
    }
    return foundQuestion;
  }

  async updateSequence(param: updateSequenceParam) {
    const foundQuestion = await this.findById(param.id);
    foundQuestion.updateSequence(param.sequence, param.userId);
    await this.questionRepository.save(foundQuestion);
    return foundQuestion
  }
}
