import { AnswerEntity } from '../../src/response/entity/answer.entity';
import { createAnswer, createResponse } from './response.fixture';
import { ResponseEntity } from '../../src/response/entity/response.entity';
import { ResponseStatus } from '../../src/response/model/response-status.enum';
import { BadRequestException } from '@nestjs/common';

describe('Answer Entity Test', () => {
  let answer: AnswerEntity;
  let response: ResponseEntity;

  beforeEach(async () => {
    response = createResponse();
    answer = createAnswer(response);
  });

  describe('update', () => {
    it('Answer Entity 정보 변경', async () => {
      const updateParam = {
        choiceName: 'update choice',
        choicePoint: 1
      };
      answer.update(updateParam);

      expect(answer.choiceName).toBe(updateParam.choiceName);
      expect(answer.choicePoint).toBe(updateParam.choicePoint);
    });
    it('Response status가 COMPLETE 일 때 예외 처리', async () => {
      response.updateStatus(ResponseStatus.COMPLETE);

      const updateParam = {
        choiceName: 'update choice',
        choicePoint: 1
      };

      await expect(async () => answer.update(updateParam)).rejects.toThrow(
        BadRequestException
      );
    });
  });
});
