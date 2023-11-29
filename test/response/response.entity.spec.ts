import { ResponseEntity } from '../../src/response/entity/response.entity';
import { createResponse } from './response.fixture';
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
    })
  });
});
