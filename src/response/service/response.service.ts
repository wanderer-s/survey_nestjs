import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ResponseEntity } from '../entity/response.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseStatus } from '../model/response-status.enum';
import { SurveyTemplateService } from '../../survey/service/survey-template.service';
import { Pagination } from '../../global/types';

type CreateResponseParam = {
  surveyTemplateId: number;
  respondentName: string;
  respondentEmail?: string;
  respondentMobile?: string;
};

type AddAnswerParam = {
  surveyTemplateId: number;
  responseId: number;
  questionId: number;
  choiceId: number;
};

type FindResponseFilter = {
  status?: ResponseStatus;
};

@Injectable()
export class ResponseService {
  constructor(
    @InjectRepository(ResponseEntity)
    private readonly responseRepository: Repository<ResponseEntity>,
    private readonly surveyTemplateService: SurveyTemplateService
  ) {}

  async create(param: CreateResponseParam) {
    const { surveyTemplateId, ...rest } = param;
    const surveyTemplate =
      await this.surveyTemplateService.findById(surveyTemplateId);

    const newResponse = new ResponseEntity({
      surveyTitle: surveyTemplate.title,
      surveyDescription: surveyTemplate.description,
      ...rest
    });
    await this.responseRepository.save(newResponse);
    return newResponse;
  }

  async findAll(pagination: Pagination, filter?: FindResponseFilter) {
    const offSet = (pagination.page - 1) * pagination.perPage
    const qb = this.responseRepository.createQueryBuilder('response');

    if (filter?.status) {
      qb.where({ status: filter.status });
    }

    qb.skip(offSet);
    qb.take(pagination.perPage);

    const [items, total] = await qb.getManyAndCount();
    return {
      items,
      total
    };
  }

  async findById(id: number) {
    const response = await this.responseRepository.findOneBy({ id });
    if (!response) {
      throw new NotFoundException();
    }
    return response;
  }

  async updateStatus(id: number, status: ResponseStatus) {
    const response = await this.findById(id);
    response.updateStatus(status);
    await this.responseRepository.save(response);
    return response;
  }

  async addAnswer(param: AddAnswerParam) {
    const { responseId, surveyTemplateId, questionId, choiceId } = param;
    const surveyTemplate =
      await this.surveyTemplateService.findById(surveyTemplateId);
    const currentQuestions = await surveyTemplate.questions;
    const foundQuestion = currentQuestions.find(
      (question) => question.id === questionId
    );
    if (!foundQuestion) {
      throw new NotFoundException();
    }
    const currentChoices = await foundQuestion.choices;
    const foundChoice = currentChoices.find((choice) => choice.id === choiceId);
    if (!foundQuestion) {
      throw new NotFoundException(foundChoice);
    }
    const response = await this.findById(responseId);
    await response.addAnswer({
      questionTitle: foundQuestion.title,
      choiceName: foundChoice.name,
      choicePoint: foundChoice.point
    });
    await this.responseRepository.save(response);
  }

  async sumPoint(id: number) {
    const response = await this.findById(id);
    return response.sumChoicePoint();
  }
}
