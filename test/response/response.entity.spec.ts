import { ResponseEntity } from '../../src/response/entity/response.entity';
import { createAnswer, createResponse } from './response.fixture';
import { ResponseStatus } from '../../src/response/model/response-status.enum';

describe('Response Entity Test', () => {
  let response: ResponseEntity;

  beforeEach(async () => {
    response = createResponse();
  });

  describe('Update Status', () => {
    it('status 변경', () => {
      response.updateStatus(ResponseStatus.COMPLETE);
      expect(response.status).toBe(ResponseStatus.COMPLETE);
    });
  });

  describe('Sum Choice Points', () => {
    it('답변의 모든 점수 힙계 반환', async () => {
      response.answers = Promise.resolve([
        createAnswer(response), // 5,
        createAnswer(response) // 5
      ]);
      const result = await response.sumChoicePoint();
      expect(result).toBe(10);
    });
  });
});
