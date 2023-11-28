import { ChoiceService } from '../../src/survey/service/choice.service';
import { Repository } from 'typeorm';
import { ChoiceEntity } from '../../src/survey/entity/choice.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createChoice } from './createSurveyFixture';
import { NotFoundException } from '@nestjs/common';

describe('Choice Service Test', () => {
  let choiceService: ChoiceService;
  let choiceRepository: Repository<ChoiceEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChoiceService,
        {
          provide: getRepositoryToken(ChoiceEntity),
          useClass: Repository
        }
      ]
    }).compile();

    choiceService = module.get<ChoiceService>(ChoiceService);
    choiceRepository = module.get<Repository<ChoiceEntity>>(
      getRepositoryToken(ChoiceEntity)
    );
  });

  describe('findById', () => {
    const choice = createChoice();
    it('주어진 id로 Choice Entity 반환', async () => {
      jest.spyOn(choiceRepository, 'findOneBy').mockResolvedValue(choice);

      const result = await choiceService.findById(1);
      expect(result).toBe(choice);
    });
    it('주어진 id로 Choice 를 찾을 수 없을 시 예외 발생', async () => {
      jest.spyOn(choiceRepository, 'findOneBy').mockResolvedValue(null);

      await expect(async () => await choiceService.findById(0)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('updateSequence', () => {
    const choice = createChoice();
    it('sequence 변경', async () => {
      jest.spyOn(choiceRepository, 'findOneBy').mockResolvedValue(choice);
      jest.spyOn(choiceRepository, 'save').mockResolvedValue(choice);

      const updateSequenceParam = {
        id: 1,
        sequence: 10,
        userId: 1
      };
      const result = await choiceService.updateSequence(updateSequenceParam);
      expect(result.sequence).toBe(updateSequenceParam.sequence);
    });
  });
});
