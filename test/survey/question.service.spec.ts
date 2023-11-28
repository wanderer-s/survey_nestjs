import { QuestionService } from '../../src/survey/service/question.service';
import { Repository } from 'typeorm';
import { QuestionEntity } from '../../src/survey/entity/question.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createQuestion } from './createSurveyFixture';
import { NotFoundException } from '@nestjs/common';

describe('Question Service Test', () => {
  let questionService: QuestionService;
  let questionRepository: Repository<QuestionEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionService,
        {
          provide: getRepositoryToken(QuestionEntity),
          useClass: Repository
        }
      ]
    }).compile();

    questionService = module.get<QuestionService>(QuestionService);
    questionRepository = module.get<Repository<QuestionEntity>>(
      getRepositoryToken(QuestionEntity)
    );
  });

  describe('findById', () => {
    const question = createQuestion();
    it('주어진 id로 Question Entity 반환 ', async () => {
      jest.spyOn(questionRepository, 'findOneBy').mockResolvedValue(question);

      const result = await questionService.findById(1);
      expect(result).toBe(question);
    });
    it('주어진 id로 Question 를 찾을 수 없을 시 예외 발생', async () => {
      jest.spyOn(questionRepository, 'findOneBy').mockResolvedValue(null);

      await expect(
        async () => await questionService.findById(0)
      ).rejects.toThrow(NotFoundException);
    });
  });
});
