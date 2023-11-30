import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createSurveyTemplate } from './survey.fixture';
import { NotFoundException } from '@nestjs/common';
import { SurveyTemplateService } from '../../src/survey/service/survey-template.service';
import { SurveyTemplateEntity } from '../../src/survey/entity/survey-template.entity';

describe('Question Service Test', () => {
  let surveyTemplateService: SurveyTemplateService;
  let surveyTemplateRepository: Repository<SurveyTemplateEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SurveyTemplateService,
        {
          provide: getRepositoryToken(SurveyTemplateEntity),
          useClass: Repository
        }
      ]
    }).compile();

    surveyTemplateService = module.get<SurveyTemplateService>(
      SurveyTemplateService
    );
    surveyTemplateRepository = module.get<Repository<SurveyTemplateEntity>>(
      getRepositoryToken(SurveyTemplateEntity)
    );
  });
  describe('findById', () => {
    const surveyTemplate = createSurveyTemplate();
    it('주어진 id로 SurveyTemplate Entity 반환 ', async () => {
      jest
        .spyOn(surveyTemplateRepository, 'findOneBy')
        .mockResolvedValue(surveyTemplate);

      const result = await surveyTemplateService.findById(1);
      expect(result).toBe(surveyTemplate);
    });
    it('주어진 id로 SurveyTemplate 를 찾을 수 없을 시 예외 발생', async () => {
      jest.spyOn(surveyTemplateRepository, 'findOneBy').mockResolvedValue(null);

      await expect(
        async () => await surveyTemplateService.findById(0)
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const surveyTemplate = createSurveyTemplate();
    it('surveyTemplate 정보 변경', async () => {
      jest
        .spyOn(surveyTemplateRepository, 'findOneBy')
        .mockResolvedValue(surveyTemplate);
      jest
        .spyOn(surveyTemplateRepository, 'save')
        .mockResolvedValue(surveyTemplate);
      const updateParam = {
        id: 1,
        userId: 1,
        title: 'update title',
        description: 'update description'
      };

      const result = await surveyTemplateService.update(updateParam);
      expect(result.title).toBe(updateParam.title);
      expect(result.description).toBe(updateParam.description);
    });
  });
});
