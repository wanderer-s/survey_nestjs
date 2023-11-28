import { Injectable, NotFoundException } from '@nestjs/common';
import { ILike, Repository } from 'typeorm';
import { SurveyTemplateEntity } from '../entity/survey-template.entity';
import { InjectRepository } from '@nestjs/typeorm';

type createSurveyTemplateParam = {
  title: string;
  description: string;
  userId: number;
};

type UpdateSurveyTemplateParam = Partial<createSurveyTemplateParam> & {
  id: number;
  userId: number;
};

type findAllParams = {
  title: string;
  page: number;
  perPage: number;
};

@Injectable()
export class SurveyTemplateService {
  constructor(
    @InjectRepository(SurveyTemplateEntity)
    private readonly surveyTemplateRepository: Repository<SurveyTemplateEntity>
  ) {}

  async create(param: createSurveyTemplateParam) {
    const surveyTemplate = new SurveyTemplateEntity(param);
    await surveyTemplate.save();

    return surveyTemplate;
  }

  async findById(id: number) {
    const foundSurveyTemplate = await this.surveyTemplateRepository.findOneBy({
      id
    });
    if (!foundSurveyTemplate) {
      throw new NotFoundException();
    }
    return foundSurveyTemplate;
  }

  async findAll(params: findAllParams) {
    const offSet = (params.page - 1) * params.perPage;

    const qb =
      this.surveyTemplateRepository.createQueryBuilder('surveyTemplate');

    if (params.title) {
      qb.where({
        title: ILike(`%${params.title}%`)
      });
    }

    qb.skip(offSet);
    qb.take(params.perPage);

    const [items, total] = await qb.getManyAndCount();

    return { items, total };
  }

  async update(param: UpdateSurveyTemplateParam) {
    const { id, ...restOfParam } = param;
    const foundSurveyTemplate = await this.findById(id);
    foundSurveyTemplate.update(restOfParam);
    return this.surveyTemplateRepository.save(foundSurveyTemplate);
  }

  async delete(id: number) {
    const foundSurveyTemplate = await this.findById(id);
    await this.surveyTemplateRepository.softRemove(foundSurveyTemplate);
  }
}
