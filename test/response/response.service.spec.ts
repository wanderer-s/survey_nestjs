import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { ResponseEntity } from '../../src/response/entity/response.entity';
import { ResponseService } from '../../src/response/service/response.service';
import { createAnswer, createResponse } from './response.fixture';
import { ResponseStatus } from '../../src/response/model/response-status.enum';
import { SurveyTemplateService } from '../../src/survey/service/survey-template.service';

describe('Response Service Test', () => {
  let responseService: ResponseService;
  let surveyTemplateService: SurveyTemplateService;
  let responseRepository: Repository<ResponseEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResponseService,
        {
          provide: SurveyTemplateService,
          useValue: {
            findById: jest.fn()
          }
        },
        {
          provide: getRepositoryToken(ResponseEntity),
          useClass: Repository
        }
      ]
    }).compile();

    responseService = module.get<ResponseService>(ResponseService);
    surveyTemplateService = module.get<SurveyTemplateService>(
      SurveyTemplateService
    );
    responseRepository = module.get<Repository<ResponseEntity>>(
      getRepositoryToken(ResponseEntity)
    );
  });

  describe('findById', () => {
    const response = createResponse();
    it('주어진 id로 Response Entity 반환', async () => {
      jest.spyOn(responseRepository, 'findOneBy').mockResolvedValue(response);

      const result = await responseService.findById(1);
      expect(result).toBe(response);
    });
    it('주어진 id로 Response 를 찾을 수 없을 시 예외 발생', async () => {
      jest.spyOn(responseRepository, 'findOneBy').mockResolvedValue(null);

      await expect(
        async () => await responseService.findById(0)
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateStatus', () => {
    const response = createResponse();
    it('status 변경', async () => {
      jest.spyOn(responseRepository, 'findOneBy').mockResolvedValue(response);
      jest.spyOn(responseRepository, 'save').mockResolvedValue(response);

      await responseService.updateStatus(1, ResponseStatus.COMPLETE);
      expect(response.status).toBe(ResponseStatus.COMPLETE);
    });
  });
  describe('sumPoint', () => {
    const response = createResponse();
    response.answers = Promise.resolve([
      createAnswer(response), // 5
      createAnswer(response) // 5
    ]);

    it('응답의 모든 point의 합계를 반환', async () => {
      jest.spyOn(responseRepository, 'findOneBy').mockResolvedValue(response);
      const result = await responseService.sumPoint(1);
      expect(result).toBe(10);
    });
  });
});
