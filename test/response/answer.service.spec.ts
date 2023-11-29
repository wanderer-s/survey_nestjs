import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { createAnswer } from './response.fixture';
import { AnswerService } from '../../src/response/service/answer.service';
import { AnswerEntity } from '../../src/response/entity/answer.entity';

describe('Answer Service Test', () => {
  let answerService: AnswerService;
  let answerRepository: Repository<AnswerEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnswerService,
        {
          provide: getRepositoryToken(AnswerEntity),
          useClass: Repository
        }
      ]
    }).compile();

    answerService = module.get<AnswerService>(AnswerService);
    answerRepository = module.get<Repository<AnswerEntity>>(
      getRepositoryToken(AnswerEntity)
    );
  });

  describe('findById', () => {
    const answer = createAnswer();
    it('주어진 id로 Answer Entity 반환', async () => {
      jest.spyOn(answerRepository, 'findOneBy').mockResolvedValue(answer);

      const result = await answerService.findById(1);
      expect(result).toBe(answer);
    });
    it('주어진 id로 Answer Entity 를 찾을 수 없을 시 예외 발생', async () => {
      jest.spyOn(answerRepository, 'findOneBy').mockResolvedValue(null);

      await expect(async () => await answerService.findById(0)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('update', () => {
    const answer = createAnswer();
    it('answer 정보 변경', async () => {
      jest.spyOn(answerRepository, 'findOneBy').mockResolvedValue(answer);
      jest.spyOn(answerRepository, 'save').mockResolvedValue(answer);

      const updateParam = {
        id: 1,
        questionTitle: 'question update'
      };

      await answerService.update(updateParam);
      expect(answer.questionTitle).toBe(updateParam.questionTitle);
    });
  });
});
